import "./Messenger.css"
import ChatTab from "../../components/messenger/ChatTab/ChatTab";
import {useEffect, useState} from "react";
import socket from "../../utils/socket";
import {Link, redirect, useLoaderData} from "react-router-dom";
import Chat from "../../components/messenger/Chat/Chat";
import chatService from "../../services/ChatService";
import authService from "../../services/AuthService";

import chat_icon from "../../images/group.png";
import user_icon from "../../images/user.png";
import Controls from "../../components/messenger/Controls/Controls";
import ChatsFilter from "../../components/messenger/ChatsFilter/ChatsFilter";

let nextMessageId = 0;

export async function loader() {
    const chatsInfo = new Map();

    const currentUser = await authService.checkAuth();

    if (!currentUser) {
        return redirect("/login");
    }

    if (!currentUser.icon || currentUser.icon === "") {
        currentUser.icon = user_icon;
    }

    const chats = await chatService.getChats(currentUser._id);

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
            (await chatService.getMessages(chat._id)).map(({_id, messages}) => {
                lastMessage = messages.at(-1);
                return [_id.datetime, messages]
            })
        );

        for (let i = 0; i < messagesMap.length; i++) {
            const dateMessagesMap = new Map();
            const datetime = messagesMap[i]._id.datetime;
            const messages = messagesMap[i].messages

            dateMessagesMap.set(datetime, messages);
            messagesMap[i] = dateMessagesMap;

            for (let j = 0; j < messages.length; j++) {
                let message = messages[j];

                messages[j] = {
                    _id: message._id,
                    text: message.text,
                    sender: chat.type === "dialog" ? message.from._id === currentUser._id ? currentUser : interlocutor : message.from,
                    chatId: message.chatId,
                    datetime: message.datetime
                }

                lastMessage = messages[j];
            }
        }

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
        socket.auth = {
            user: {
                _id: currentUser._id,
                name: currentUser.name,
                surname: currentUser.surname,
                online: true
            }
        };

        socket.connect();
        socket.emit("check users");
    }, [currentUser]);

    useEffect(() => {
        chatService.getChats(currentUser._id).then((allChats) => {
            for (const chat of allChats) {
                socket.emit("join_room", chat._id);
            }
        });
    }, [currentUser]);

    useEffect(() => {
        socket.on("users", (users) => {
            const temp = chats;

            for (let [key, value] of temp) {
                for (let user of users) {
                    if (value.type === "dialog") {
                        if (value.interlocutor._id === user._id) {
                            value.interlocutor.online = true;
                        }
                    }
                }
            }

            setChats(new Map(temp));
        });

        socket.on("user connected", (connectedUser) => {
            const temp = chats;

            for (let [key, value] of temp) {
                if (value.type === "dialog") {
                    if (value.interlocutor._id === connectedUser._id) {
                        value.interlocutor.online = true;
                        setChats(new Map(temp));
                        return;
                    }
                }
            }
        });

        socket.on("user disconnected", (userId) => {
            const temp = chats;

            for (let [key, value] of temp) {
                if (value.type === "dialog") {
                    if (value.interlocutor._id === userId) {
                        value.interlocutor.online = false;
                        setChats(new Map(temp));
                        return;
                    }
                }
            }
        });

        return () => {
            socket.off("users");
            socket.off("user connected");
            socket.off("user disconnected");
        }
    }, [chats]);

    useEffect(() => {
        socket.on("message", ({text, from, to, date}) => {
            let temp = chats.get(to);

            const receivedMessage = {
                _id: nextMessageId++,
                text: text,
                sender: temp.users.get(from),
                chatId: temp._id,
                datetime: date
            };

            const formattedSendDate = new Date(date).toLocaleDateString("ru-RU", {
                day: "numeric",
                month: "numeric",
                year: "numeric"
            });

            if (!temp.messages.get(formattedSendDate)) {
                temp.messages.set(formattedSendDate, [receivedMessage]);
            } else {
                temp.messages.get(formattedSendDate).push(receivedMessage);
            }
            temp.lastMessage = receivedMessage;

            const tempChats = chats;
            tempChats.get(temp._id).lastMessage = receivedMessage;

            if (!selectedChat || selectedChat._id !== temp._id) {
                tempChats.get(temp._id).hasNewMessages = true;
            }

            if (selectedChat && selectedChat._id === temp._id) {
                setSelectedChat({...temp});
            }

            setChats(new Map(tempChats));
        });

        return () => {
            socket.off("message");
        }
    }, [selectedChat, chats]);

    function handleMessageSubmit(text) {
        if (selectedChat) {
            const sendDate = new Date();

            socket.emit("message", {
                text: text,
                to: selectedChat._id,
                date: sendDate
            });

            const temp = selectedChat;
            const newMessage = {
                _id: nextMessageId++,
                text: text,
                sender: currentUser,
                chatId: selectedChat._id,
                datetime: sendDate
            };

            const formattedSendDate = sendDate.toLocaleDateString("ru-RU", {
                day: "numeric",
                month: "numeric",
                year: "numeric"
            });

            if (!temp.messages.get(formattedSendDate)) {
                temp.messages.set(formattedSendDate, [newMessage]);
            } else {
                temp.messages.get(formattedSendDate).push(newMessage);
            }

            const to = selectedChat.type === "dialog" ? selectedChat.interlocutor._id : selectedChat._id;
            chatService.saveMessage(text, currentUser._id, to, selectedChat._id, sendDate).then(message => {

            });

            const tempChats = chats;
            tempChats.get(selectedChat._id).lastMessage = newMessage;

            setSelectedChat({...temp});
            setChats(new Map(tempChats));
        }
    }

    return (
        <div className="messenger">
            {(currentUser.roles.includes("admin") || currentUser.roles.includes("teacher"))  &&
                <Controls
                    chats={chats}
                    currentUser={currentUser}
                    onSendMailingClick={(messages, chatIds) => {
                        const tempChats = chats;

                        for (const chatId of chatIds) {
                            for (const message of messages) {
                                socket.emit("message", {
                                    text: message.text,
                                    to: chatId,
                                    date: message.date
                                });

                                const newMessage = {
                                    _id: nextMessageId++,
                                    text: message.text,
                                    sender: currentUser,
                                    chatId: chatId,
                                    datetime: message.date
                                };

                                const formattedSendDate = message.date.toLocaleDateString("ru-RU", {
                                    day: "numeric",
                                    month: "numeric",
                                    year: "numeric"
                                });

                                const chat = chats.get(chatId);
                                if (!chat.messages.get(formattedSendDate)) {
                                    chat.messages.set(formattedSendDate, [newMessage]);
                                } else {
                                    chat.messages.get(formattedSendDate).push(newMessage);
                                }

                                chatService.saveMessage(message.text, currentUser._id, chatId, chatId, message.date).then(message => {

                                });

                                tempChats.get(chatId).lastMessage = newMessage;
                            }
                        }

                        setChats(new Map(tempChats));
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
                    <ChatsFilter onSearchGroup={(filter) => setChatsFilter(filter)} />
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
                                    <h3>Главная группа</h3>:
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
        </div>
    )
};