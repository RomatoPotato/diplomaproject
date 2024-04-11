import "./Messenger.css"
import UserTab from "../../components/messenger/UserTab/UserTab";
import {useEffect, useState} from "react";
import socket from "../../util/socket";
import {useLoaderData, useSearchParams} from "react-router-dom";
import userService from "../../services/UserService";
import Chat from "../../components/messenger/Chat/Chat";

export default function Messenger() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    const currentUser = useLoaderData();

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
    }, [users]);

    useEffect(() => {
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

    function handleCloseContactClick() {
        setSelectedUser(null);
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
                        users.map(
                            user => user._id !== currentUser._id &&
                                <UserTab
                                    onChatTabClick={() => {
                                        setSelectedUser(user);
                                    }}
                                    key={user._id}
                                    user={user}/>
                        )
                    }
                </div>
            </div>
            <Chat
                selectedContact={selectedUser}
                currentUser={currentUser}
                onMessageSubmit={handleMessageSubmit}
                onCloseContactClick={handleCloseContactClick}/>
        </div>
    )
};