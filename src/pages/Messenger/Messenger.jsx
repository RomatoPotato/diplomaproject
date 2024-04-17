import "./Messenger.css"
import ChatTab from "../../components/messenger/ChatTab/ChatTab";
import {useEffect, useState} from "react";
import socket from "../../util/socket";
import {redirect, useLoaderData} from "react-router-dom";
import Chat from "../../components/messenger/Chat/Chat";
import chatService from "../../services/ChatService";
import authService from "../../services/AuthService";

let nextMessageId = 0;

export async function loader() {
    const chatsInfo = new Map();

    const currentUser = await authService.checkAuth();

    if (!currentUser) {
        return redirect("/login");
    }

    const chats = await chatService.getChats(currentUser._id);

    for (const chat of chats) {
        let interlocutor;
        if (!chat.isGroup) {
            interlocutor = chat.users[0]._id === currentUser._id ? chat.users[1] : chat.users[0];
            interlocutor = {
                _id: interlocutor._id,
                name: interlocutor.name,
                surname: interlocutor.surname,
                online: false
            }
        }

        const chatName = chat.isGroup ? chat.name : interlocutor.name + " " + interlocutor.surname;
        let messages = await chatService.getMessages(chat._id);

        for (let i = 0; i < messages.length; i++) {
            const message = messages[i];

            messages[i] = {
                _id: message._id,
                text: message.text,
                sender: chat.isGroup ? message.from : message.from._id === currentUser._id ? currentUser : interlocutor,
                chatId: message.chatId,
                datetime: message.datetime
            }
        }

        let users = new Map();
        for (let user of chat.users) {
            users.set(user._id, {
                name: user.name,
                surname: user.surname
            });
        }

        chatsInfo.set(chat._id, {
            _id: chat._id,
            chatName: chatName,
            isGroup: chat.isGroup,
            users: users,
            interlocutor: interlocutor,
            messages: messages,
            lastMessage: messages.at(-1)
        });
    }

    console.log(chatsInfo)

    return {
        currentUser,
        chatsInfo
    };
}

export default function Messenger() {
    let {currentUser, chatsInfo} = useLoaderData();

    const [chats, setChats] = useState(chatsInfo);
    const [selectedChat, setSelectedChat] = useState(null);

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
                    if (!value.isGroup) {
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
                if (!value.isGroup) {
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
                if (!value.isGroup) {
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

            temp.messages.push(receivedMessage);
            temp.lastMessage = receivedMessage;

            const tempChats = chats;
            tempChats.get(temp._id).lastMessage = receivedMessage;

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
            socket.emit("message", {
                text: text,
                to: selectedChat._id,
                date: Date.now()
            });

            const temp = selectedChat;
            const newMessage = {
                _id: nextMessageId++,
                text: text,
                sender: currentUser,
                chatId: selectedChat._id,
                datetime: Date.now()
            };

            temp.messages.push(newMessage);

            const to = selectedChat.isGroup ? selectedChat._id : selectedChat.interlocutor._id;
            chatService.saveMessage(text, currentUser._id, to, selectedChat._id, Date.now()).then(message => {

            });

            const tempChats = chats;
            tempChats.get(selectedChat._id).lastMessage = newMessage;

            setSelectedChat({...temp});
            setChats(new Map(tempChats));
        }
    }

    function handleCloseContactClick() {
        //setSelectedUser(null);
        setSelectedChat(null);
    }

    return (
        <div className="messenger">
            <div className="left-side">
                <div className="left-side__user-info">
                    <div>
                        <p>{currentUser.name} {currentUser.surname}</p>
                        <b>{currentUser.login}</b>
                    </div>
                    <img src={currentUser.icon} alt=""/>
                </div>
                <div className="left-side__user-tabs">
                    {
                        Array.from(chats, ([key, value]) => (value)).map(chat =>
                            <ChatTab
                                key={chat._id}
                                chat={chat}
                                onChatTabClick={() => {
                                    setSelectedChat({
                                        ...chat
                                    });
                                }}/>
                        )
                    }
                </div>
            </div>
            <Chat
                selectedChat={selectedChat}
                currentUser={currentUser}
                onMessageSubmit={handleMessageSubmit}
                onCloseContactClick={handleCloseContactClick}/>
        </div>
    )
};