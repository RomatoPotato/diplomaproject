import "./Messenger.css"
import ChatTab from "../../components/messenger/ChatTab/ChatTab";
import React, {useEffect, useState} from "react";
import {Link, redirect, useLoaderData} from "react-router-dom";
import Chat from "../../components/messenger/Chat/Chat";
import ChatService from "../../services/ChatService";
import AuthService from "../../services/AuthService";
import user_icon from "../../images/user.png";
import Controls from "../../components/messenger/Controls/Controls";
import ChatsFilter from "../../components/messenger/ChatsFilter/ChatsFilter";
import {ContextMenu} from "../../components/ui/ContextMenu/ContextMenu";
import MessagesService from "../../services/MessagesService";
import socketHelper from "../../utils/MessengerSocketHelper";
import DialogWindow from "../../components/ui/DialogWindow/DialogWindow";
import ChatInfo from "../../components/messenger/ChatInfo/ChatInfo";
import chatsStateManager from "../../utils/ChatsStateManager";
import Header from "../../components/messenger/Header/Header";
import ChatInput from "../../components/messenger/ChatInput/ChatInput";
import EditMessagePlane from "../../components/messenger/EditMessagePlane/EditMessagePlane";
import SelectMessagesPlane from "../../components/messenger/SelectMessagesPlane/SelectMessagesPlane";
import listener from "../../utils/GlobalEventListeners/SelectMessageEventListener";
import DialogMenu from "../../components/ui/DialogMenu/DialogMenu";
import {show as showDialog} from "../../utils/GlobalEventListener";
import messengerSocketHelper from "../../utils/MessengerSocketHelper";

export async function loader() {
    const chatsInfo = new Map();

    const currentUser = await AuthService.checkAuth();

    if (!currentUser) {
        return redirect("/login");
    }

    if (!currentUser.icon || currentUser.icon === "") {
        currentUser.icon = user_icon;
    }

    const chats = await ChatService.getChats(currentUser._id);

    for (const chat of chats) {
        let interlocutor;
        if (chat.type === "dialog") {
            interlocutor = chat.users[0]._id === currentUser._id ? chat.users[1] : chat.users[0];
            interlocutor = {
                _id: interlocutor._id,
                name: interlocutor.name,
                surname: interlocutor.surname,
                online: false
            }
        }

        let lastMessage;
        const chatName = chat.type === "dialog" ? interlocutor.name + " " + interlocutor.surname : chat.name;
        let messagesMap = new Map(
            (await MessagesService.getMessages(chat._id)).map(({_id, messages}) => {
                messages = messages.filter(message => !message.deletedUsers.includes(currentUser._id));

                if (messages.length === 0){
                    return [];
                }

                lastMessage = messages.at(-1);
                return [_id.datetime, messages];
            })
        );
        messagesMap.delete(undefined);

        let users = new Map();
        for (let user of chat.users) {
            users.set(user._id, user);
        }

        chatsInfo.set(chat._id, {
            _id: chat._id,
            name: chatName,
            type: chat.type,
            users: users,
            group: chat.group,
            interlocutor: interlocutor,
            messages: messagesMap,
            lastMessage: lastMessage
        });
    }

    console.log(chatsInfo)

    return {
        currentUser,
        chatsInfo
    };
}

export default function Messenger() {
    const {currentUser, chatsInfo} = useLoaderData();

    const [chats, setChats] = useState(chatsInfo);
    const [selectedChat, setSelectedChat] = useState(null);
    const [showChatInfo, setShowChatInfo] = useState(false);
    const [chatsFilter, setChatsFilter] = useState(() => (f) => f);

    const [editMode, setEditMode] = useState({
        enabled: false,
        message: null
    });
    const [selectMode, setSelectMode] = useState({
        enabled: false,
        messagesData: null
    });

    function disableEditMode() {
        setEditMode({
            enabled: false,
            message: null
        });
    }

    function disableSelectMode() {
        setSelectMode({
            enabled: false,
            messagesData: null
        });
        const eventClear = new CustomEvent("clear_selecteds");
        window.dispatchEvent(eventClear);
    }

    useEffect(() => {
        socketHelper.connectUser(currentUser);

        ChatService.getChats(currentUser._id).then((allChats) => {
            for (const chat of allChats) {
                socketHelper.emitJoinRoom(chat);
            }
        });
    }, [currentUser]);

    useEffect(() => {
        socketHelper.addUsersListeners(setChats, chats);
        socketHelper.addMessagesListeners(setChats, chats);

        return () => {
            socketHelper.removeUsersListeners();
            socketHelper.removeMessagesListeners();
        }
    }, [chats]);

    listener.register((messagesData) => {
        setSelectMode({
            enabled: true,
            messagesData
        });
    });

    async function handleMessageSubmit(text) {
        if (editMode.enabled) {
            disableEditMode();

            if (editMode.messageData.message.text !== text) {
                await socketHelper.editMessage(editMode.messageData, text);
                chatsStateManager.editMessage(setChats, chats, editMode.messageData, text);
            }
        } else {
            await socketHelper.sendMessage(setChats, chats, selectedChat, currentUser, text);
        }
    }

    return (
        <div className="messenger">
            {(currentUser.roles.includes("admin") || currentUser.roles.includes("teacher")) &&
                <Controls
                    chats={chats}
                    currentUser={currentUser}
                    onSendMailingClick={async (messages, chatIds) => {
                        for (const chatId of chatIds) {
                            for (const message of messages) {
                                await socketHelper.sendMessage(setChats, chats, chats.get(chatId), currentUser, message.text);
                            }
                        }
                    }}/>
            }
            <div className="messenger__wrapper">
                <div className="left-side">
                    <div className="left-side__chat-info">
                        <div>
                            <p>{currentUser.name} {currentUser.surname}</p>
                            <b>{currentUser.login}</b>
                        </div>
                        <Link to="../account"><img src={currentUser.icon} alt=""/></Link>
                    </div>
                    <ChatsFilter onSearchGroup={(filter) => setChatsFilter(filter)}/>
                    <div className="left-side__chat-tabs">
                        {Array.from(chats.values()).filter(chatsFilter).length === 0 &&
                            <p>Чаты не найдены(</p>
                        }
                        {Array.from(chats.values()).filter(chatsFilter).map(chat =>
                            <ChatTab
                                key={chat._id}
                                chat={chat}
                                onChatTabClick={() => {
                                    chat.hasNewMessages = false;
                                    setSelectedChat({
                                        ...chat
                                    });
                                    if (editMode.enabled && selectedChat._id !== chat._id) {
                                        disableEditMode();
                                    }
                                    if (selectMode.enabled && selectedChat._id !== chat._id){
                                        disableSelectMode();
                                    }
                                }}/>
                        )}
                    </div>
                </div>
                <div className="messenger__chat-space">
                    {selectedChat ?
                        <>
                            <Header
                                selectedChat={selectedChat}
                                onCloseButtonClick={() => setSelectedChat(null)}
                                onChatInfoClick={() => setShowChatInfo(true)}/>
                            {selectMode.enabled &&
                                <SelectMessagesPlane
                                    selectMode={selectMode}
                                    onDeleteButtonClick={() => {
                                        showDialog("delete-selected-dm", selectMode.messagesData);
                                    }}
                                    onCloseButtonClick={() => {
                                        disableSelectMode();
                                    }}/>
                            }
                            <Chat
                                selectedChat={selectedChat}
                                currentUser={currentUser}
                                selectMode={selectMode}/>
                            {editMode.enabled &&
                                <EditMessagePlane
                                    message={editMode.enabled && editMode.messageData.message}
                                    onCloseButtonClick={disableEditMode}/>
                            }
                            <ChatInput onMessageSubmit={handleMessageSubmit}
                                       text={editMode.enabled ? editMode.messageData.message.text : ""}/>
                        </> :
                        <div className="messenger__unselected-chat-alert">
                            <p>Выберите группу или собеседника</p>
                        </div>
                    }
                </div>
            </div>
            {showChatInfo && <ChatInfo selectedChat={selectedChat} onCloseChatInfo={() => setShowChatInfo(false)}/>}
            <div className="messenger__menus">
                <ContextMenu contextMenuItems={[
                    {
                        text: "Переслать"
                    },
                    {
                        text: "Выбрать",
                        onClick(data) {
                            setSelectMode({
                                enabled: true,
                                messagesData: data
                            });
                            const event = new CustomEvent("select_message", {
                                detail: {
                                    messageData: data,
                                    selected: true
                                }
                            });
                            window.dispatchEvent(event);
                        }
                    },
                    {
                        text: "Копировать",
                        onClick(data) {
                            navigator.clipboard.writeText(data.message.text).then(() => console.log("Copied!\n" + data.message.text));
                        }
                    },
                    {
                        text: "Редактировать",
                        hideCondition: {
                            self: false
                        },
                        onClick(data) {
                            setEditMode({
                                enabled: true,
                                messageData: data
                            })
                        }
                    },
                    {
                        text: "Удалить у себя",
                        isDanger: true,
                        async onClick(data) {
                            showDialog("delete-message", {
                                ...data,
                                deleteForSelf: true
                            });
                        }
                    },
                    {
                        text: "Удалить у всех",
                        hideCondition: {
                            self: false
                        },
                        isDanger: true,
                        async onClick(data) {
                            showDialog("delete-message", {
                                ...data,
                                deleteForAll: true
                            });
                        }
                    }
                ]}/>
                <DialogWindow
                    name="delete-message"
                    title="Удалить сообщение?"
                    warningText="Сообщение будет безвозвратно удалено!"
                    positiveButtonClick={async (data) => {
                        chatsStateManager.deleteMessage(setChats, chats, data);
                        await socketHelper.deleteMessage(selectedChat, data, currentUser._id);
                    }}/>
                <DialogMenu name="delete-selected-dm" title="Удалить выбранные сообщения?" items={[
                    {
                        text: "Удалить у себя",
                        isDanger: true,
                        async onClick(){
                            disableSelectMode();
                            await messengerSocketHelper.deleteManyMessages(selectedChat, selectMode.messagesData, currentUser._id);
                            chatsStateManager.deleteManyMessages(setChats, chats, selectMode.messagesData);
                        }
                    },
                    {
                        text: "Удалить у всех",
                        hideCondition: selectMode.messagesData?.filter(messageData => messageData.message.self === false).length > 0,
                        isDanger: true,
                        async onClick(){
                            disableSelectMode();
                            await messengerSocketHelper.deleteManyMessages(selectedChat, selectMode.messagesData, currentUser._id, true);
                            chatsStateManager.deleteManyMessages(setChats, chats, selectMode.messagesData);
                        }
                    }
                ]} />
            </div>
        </div>
    )
};