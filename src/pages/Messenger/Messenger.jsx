import "./Messenger.css"
import ChatTab from "../../components/messenger/ChatTab/ChatTab";
import React, {useEffect, useState} from "react";
import {Link, redirect, useLoaderData} from "react-router-dom";
import Chat from "../../components/messenger/Chat/Chat";
import ChatService from "../../services/ChatService";
import AuthService from "../../services/AuthService";
import chat_icon from "../../images/group.png";
import user_icon from "../../images/user.png";
import Controls from "../../components/messenger/Controls/Controls";
import ChatsFilter from "../../components/messenger/ChatsFilter/ChatsFilter";
import {ContextMenu} from "../../components/ui/ContextMenu/ContextMenu";
import MessagesService from "../../services/MessagesService";
import socketHelper from "../../utils/MessengerSocketHelper";
import chatsStateManager from "../../utils/ChatsStateManager";

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
                lastMessage = messages.at(-1);
                return [_id.datetime, messages]
            })
        );

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

    useEffect(() => {
        socketHelper.connectUser(currentUser);
    }, [currentUser]);

    useEffect(() => {
        ChatService.getChats(currentUser._id).then((allChats) => {
            for (const chat of allChats) {
                socketHelper.emitJoinRoom(chat);
            }
        });
    }, [currentUser]);

    useEffect(() => {
        socketHelper.addUsersListeners(setChats, chats);

        return () => {
            socketHelper.removeUsersListeners();
        }
    }, [chats]);

    useEffect(() => {
        socketHelper.addMessagesListeners(setChats, chats);

        return () => {
            socketHelper.removeMessagesListeners();
        }
    }, [selectedChat, chats]);

    async function handleMessageSubmit(text) {
        if (selectedChat) {
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
                    <div className="left-side__user-info">
                        <div>
                            <p>{currentUser.name} {currentUser.surname}</p>
                            <b>{currentUser.login}</b>
                        </div>
                        <Link to="../account"><img src={currentUser.icon} alt=""/></Link>
                    </div>
                    <ChatsFilter onSearchGroup={(filter) => setChatsFilter(filter)}/>
                    <div className="left-side__user-tabs">
                        {Array.from(chats, ([key, value]) => (value)).filter(chatsFilter).length === 0 &&
                            <p>Чаты не найдены(</p>
                        }
                        {Array.from(chats, ([key, value]) => (value)).filter(chatsFilter).map(chat =>
                            <ChatTab
                                key={chat._id}
                                chat={chat}
                                onChatTabClick={() => {
                                    chat.hasNewMessages = false;
                                    setSelectedChat({
                                        ...chat
                                    });
                                }}/>
                        )}
                    </div>
                </div>
                <Chat
                    selectedChat={selectedChat}
                    currentUser={currentUser}
                    onMessageSubmit={handleMessageSubmit}
                    onCloseChatClick={() => setSelectedChat(null)}
                    onShowChatInfoClick={() => setShowChatInfo(true)}/>
            </div>
            {showChatInfo &&
                <div className="chat-info" onClick={() => setShowChatInfo(false)}>
                    <div className="chat-info__content" onClick={(e) => e.stopPropagation()}>
                        <div className="info-header">
                            <div className="info-header__icon-area">
                                <img src={selectedChat.icon ? selectedChat.icon : chat_icon}/>
                            </div>
                            <div className="info-header__text-area">
                                <h2>{selectedChat.name}</h2>
                                {selectedChat.type === "mainGroup" ?
                                    <h3>Главная группа</h3> :
                                    <h3>{selectedChat.group.name}</h3>
                                }
                            </div>
                        </div>
                        <div className="info-body">
                            {selectedChat.type === "mainGroup" &&
                                <>
                                    <h3>Админы</h3>
                                    {Array.from(selectedChat.users.entries())
                                        .filter(([id, user]) => user.roles.includes("admin"))
                                        .map(([id, user]) =>
                                            <p key={id}>{user.surname} {user.name} {user.middlename}</p>
                                        )}
                                    <h3>Куратор</h3>
                                    {Array.from(selectedChat.users.entries())
                                        .filter(([id, user]) => user.roles.includes("curator"))
                                        .map(([id, user]) =>
                                            <p key={id}>{user.surname} {user.name} {user.middlename}</p>
                                        )}
                                    <h3>Староста</h3>
                                    {Array.from(selectedChat.users.entries())
                                        .filter(([id, user]) => user.roles.includes("headman"))
                                        .map(([id, user]) =>
                                            <p key={id}>{user.surname} {user.name} {user.middlename}</p>
                                        )}
                                    <h3>Студентота</h3>
                                    {Array.from(selectedChat.users.entries())
                                        .filter(([id, user]) => user.roles.includes("student"))
                                        .filter(([id, user]) => !user.roles.includes("headman"))
                                        .map(([id, user]) =>
                                            <p key={id}>{user.surname} {user.name} {user.middlename}</p>
                                        )}
                                </>
                            }
                            {selectedChat.type === "studyGroup" &&
                                <>
                                    <h3>Преподаватель</h3>
                                    {Array.from(selectedChat.users.entries())
                                        .filter(([id, user]) => user.roles.includes("teacher"))
                                        .map(([id, user]) =>
                                            <p key={id}>{user.surname} {user.name} {user.middlename}</p>
                                        )}
                                    <h3>Староста</h3>
                                    {Array.from(selectedChat.users.entries())
                                        .filter(([id, user]) => user.roles.includes("headman"))
                                        .map(([id, user]) =>
                                            <p key={id}>{user.surname} {user.name} {user.middlename}</p>
                                        )}
                                    <h3>Студентота</h3>
                                    {Array.from(selectedChat.users.entries())
                                        .filter(([id, user]) => user.roles.includes("student"))
                                        .filter(([id, user]) => !user.roles.includes("headman"))
                                        .map(([id, user]) =>
                                            <p key={id}>{user.surname} {user.name} {user.middlename}</p>
                                        )}
                                </>
                            }
                        </div>
                        <div className="info-footer">

                        </div>
                    </div>
                </div>
            }
            <div className="messenger__context-menus">
                <ContextMenu contextMenuItems={[
                    {
                        text: "Переслать"
                    },
                    {
                        text: "Выбрать"
                    },
                    {
                        text: "Копировать",
                        onClick(data) {
                            navigator.clipboard.writeText(data.message.text)
                                .then(() => console.log("Copied!\n" + data.message.text));
                        }
                    },
                    {
                        text: "Редактировать"
                    },
                    {
                        text: "Удалить",
                        isDanger: true,
                        async onClick(data) {
                            chatsStateManager.deleteMessage(setChats, chats, data);
                            await socketHelper.deleteMessage(data);
                        }
                    }
                ]}/>
            </div>
        </div>
    )
};