import "./Messenger.css"
import UserTab from "../../components/messenger/UserTab/UserTab";
import ChatInput from "../../components/messenger/ChatInput/ChatInput";
import {useEffect, useState} from "react";
import socket from "../../util/socket";
import Message from "../../components/messenger/Message/Message";
import Header from "../../components/messenger/Header/Header";
import {NavLink, useLoaderData, useSearchParams} from "react-router-dom";
import userService from "../../services/UserService";

export default function Messenger() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    const currentUser = useLoaderData();
    const [searchParams, setSearchParams] = useSearchParams();

    let convId = searchParams.get("conv");

    if (convId && convId !== selectedUser?._id) {
        userService.getUser(convId).then(user => {
            for (const currUser of users) {
                if (currUser._id === user._id) {
                    setSelectedUser(currUser);
                }
            }
        });
    }

    useEffect(() => {
        socket.on("users", (allUsers) => {
            allUsers.forEach((user) => {
                user.connected = true;
            });

            setUsers(allUsers);
        });

        socket.on("user connected", (newUser) => {
            let temp = users;

            for (let user of temp) {
                if (user._id === newUser._id) {
                    user.connected = true;

                    setUsers([
                        ...temp
                    ]);
                    return;
                }
            }

            setUsers([
                ...users,
                {
                    ...newUser,
                    connected: true
                }
            ])
        });

        socket.on("user disconnected", (userId) => {
            const temp = users;

            for (let i = 0; i < temp.length; i++) {
                const user = temp[i];

                if (user._id === userId) {
                    user.connected = false;
                    break;
                }
            }

            setUsers([
                ...temp
            ]);
        });

        socket.on("private message", ({text, from, date}) => {
            for (let i = 0; i < users.length; i++) {
                const user = users[i];

                if (user._id === from) {
                    user.messages.push({
                        text: text,
                        fromSelf: false,
                        date: date
                    });

                    if (user !== selectedUser) {
                        user.hasNewMessages = true;
                    }
                }
            }

            setUsers([
                ...users
            ]);

            if (selectedUser) {
                setSelectedUser({
                    ...selectedUser
                });
            }
        });

        return () => {
            socket.off("users");
            socket.off("user connected");
            socket.off("user disconnected");
            socket.off("private message");
        }
    }, [selectedUser, users]);

    function handleMessageSubmit(message) {
        if (selectedUser) {
            socket.emit("private message", {
                text: message,
                to: selectedUser._id,
                date: Date.now()
            });

            selectedUser.messages.push({
                text: message,
                fromSelf: true,
                date: Date.now()
            });

            setUsers([
                ...users
            ]);
        }
    }

    return (
        <div className="messenger">
            <div className="messenger__user-tabs">
                {
                    users.map(
                        user => user._id !== currentUser._id &&
                            <UserTab
                                onChatTabClick={() => {
                                    setSearchParams({"conv": user._id});
                                }}
                                key={user._id}
                                user={user}/>
                    )
                }
            </div>
            <div className="messenger__chat-space">
                <Header selectedUser={selectedUser} currentUser={currentUser}/>
                <div className="chat">
                    <div className="chat-wrapper">
                        {selectedUser && selectedUser.messages.map(message => {
                            return <Message
                                key={message.text}
                                sender={message.fromSelf ? currentUser : selectedUser}
                                text={message.text}
                                self={message.fromSelf}
                                date={message.date}/>
                        })}
                    </div>
                </div>
                <ChatInput onMessageSubmit={handleMessageSubmit}/>
            </div>
        </div>
    )
};