import "./Messenger.css"
import ChatTab from "../../components/messenger/ChatTab/ChatTab";
import React, {useContext, useEffect, useState} from "react";
import {Link, redirect, useLoaderData} from "react-router-dom";
import Chat from "../../components/messenger/Chat/Chat";
import ChatService from "../../services/ChatService";
import AuthService from "../../services/AuthService";
import Controls from "../../components/messenger/Controls/Controls";
import ChatsFilter from "../../components/messenger/ChatsFilter/ChatsFilter";
import MessagesService from "../../services/MessagesService";
import socketHelper from "../../utils/MessengerSocketHelper";
import MailingWindow from "../../components/windows/MailingWindow/MailingWindow";
import {ChatsContext, ChatsDispatchContext, ChatsProvider} from "../../contexts/ChatsContext";
import socket from "../../utils/socket";

export async function loader() {
    const chatsInfo = new Map();

    const currentUser = await AuthService.checkAuth();

    if (!currentUser) {
        return redirect("/login");
    }

    if (!currentUser.icon || currentUser.icon === "") {
        currentUser.icon = "static/images/user.png";
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

                if (messages.length === 0) {
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
    //console.log("mounted");
    const {currentUser, chatsInfo} = useLoaderData();

    const [chats, setChats] = useState(chatsInfo);
    const [selectedChat, setSelectedChat] = useState(null);
    const [chatsFilter, setChatsFilter] = useState(() => (f) => f);

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

        return () => {
            socketHelper.removeUsersListeners();
        }
    }, [chats]);

    return (
        <div className="messenger">
            <ChatsProvider chatsInitial={chats}>
                <MessagesController selectedChatId={selectedChat?._id} />
                <div className="messenger__wrapper">
                    <div className="left-side">
                        <div className="left-side__user-info">
                            <Link to="../account"><img src={currentUser.icon} alt="Иконка пользователя"/></Link>
                            <div>
                                <p>{currentUser.surname} {currentUser.name} {currentUser.middlename}</p>
                                <p><b>{currentUser.login}</b></p>
                            </div>
                        </div>
                        <ChatsFilter onSearchGroup={(filter) => setChatsFilter(filter)}/>
                        <div className="left-side__chat-tabs">
                            {Array.from(chats.values()).filter(chatsFilter).length === 0 &&
                                <p className="left-side__not-found-chats">Чаты не найдены(</p>
                            }
                            {Array.from(chats.values()).filter(chatsFilter).map(chat =>
                                <ChatTab
                                    key={chat._id}
                                    chatId={chat._id}
                                    selected={chat._id === selectedChat?._id}
                                    showGroup={currentUser.roles.includes("admin") || currentUser.roles.includes("teacher")}
                                    onChatTabClick={() => {
                                        chat.hasNewMessages = false;
                                        setSelectedChat({
                                            ...chat
                                        });
                                    }}/>
                            )}
                        </div>
                    </div>
                    <div className="messenger__chat-space">
                        {selectedChat ?
                            <Chat
                                key={selectedChat._id}
                                selectedChatId={selectedChat?._id}
                                currentUser={currentUser}
                                onCloseChatClick={() => setSelectedChat(null)}/> :
                            <div className="messenger__unselected-chat-alert">
                                <p>Выберите группу или собеседника</p>
                            </div>
                        }
                    </div>
                    {(currentUser.roles.includes("admin") || currentUser.roles.includes("teacher")) &&
                        <Controls/>
                    }
                </div>
                <div className="messenger__menus">
                    <MailingWindow
                        chats={chats}
                        currentUser={currentUser} />
                </div>
            </ChatsProvider>
        </div>
    )
};

const MessagesController = ({selectedChatId}) => {
    const dispatch = useContext(ChatsDispatchContext);
    const allChats = useContext(ChatsContext);
    const currentChat = allChats.get(selectedChatId);

    useEffect(() => {
        socket.on("message", (message) => {
            let destinationChat = allChats.get(message.to);

            const receivedMessage = {
                _id: message.id,
                text: message.text,
                sender: destinationChat.users.get(message.from),
                chatId: destinationChat._id,
                datetime: message.date,
                type: message.type,
                attachments: message.attachments
            };

            dispatch({
                type: "messageAdded",
                chatId: destinationChat._id,
                message: receivedMessage
            });
        });

        socket.on("delete message", (messageData) => {
            dispatch({
                type: "messageDeleted",
                chatId: messageData.message.chatId,
                messageData
            });
        });

        socket.on("delete messages", (messagesData) => {
            dispatch({
                type: "manyMessagesDeleted",
                messagesData
            });
        });

        socket.on("edit message", ({messageData, text}) => {
            dispatch({
                type: "messageEdited",
                chatId: messageData.message.chatId,
                text,
                messageData
            });
        });

        socket.on("mailing", (messages) => {
            dispatch({
                type: "manyMessagesAdded",
                messages
            });
        });

        return () => {
            socket.off("message");
            socket.off("delete message");
            socket.off("delete messages");
            socket.off("edit message");
            socket.off("mailing");
        }
    }, [allChats, currentChat?._id, dispatch]);
}