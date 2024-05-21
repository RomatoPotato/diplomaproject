import React from 'react';
import "./ChatInfo.css";

const ChatInfo = ({selectedChat, onCloseChatInfo}) => {
    return (
        <div className="backdrop" onClick={onCloseChatInfo}>
            <div className="chat-info" onClick={(e) => e.stopPropagation()}>
                <div className="chat-info__header">
                    <div className="chat-info__icon-box">
                        <img src={selectedChat.icon ? selectedChat.icon : "static/images/group.png"} alt="chat icon"/>
                    </div>
                    <div className="chat-info__text-box">
                        <h2>{selectedChat.name}</h2>
                        {selectedChat.type === "mainGroup" ?
                            <h3>Главная группа</h3> :
                            <h3>{selectedChat.group.name}</h3>
                        }
                    </div>
                </div>
                <div className="chat-info__body">
                    {selectedChat.type === "mainGroup" &&
                        <>
                            <h3>Админы</h3>
                            {Array.from(selectedChat.users.entries())
                                .filter(([, user]) => user.roles.includes("admin"))
                                .map(([id, user]) =>
                                    <p key={id}>{user.surname} {user.name} {user.middlename}</p>
                                )}
                            <h3>Куратор</h3>
                            {Array.from(selectedChat.users.entries())
                                .filter(([, user]) => user.roles.includes("curator"))
                                .map(([id, user]) =>
                                    <p key={id}>{user.surname} {user.name} {user.middlename}</p>
                                )}
                            <h3>Староста</h3>
                            {Array.from(selectedChat.users.entries())
                                .filter(([, user]) => user.roles.includes("headman"))
                                .map(([id, user]) =>
                                    <p key={id}>{user.surname} {user.name} {user.middlename}</p>
                                )}
                            <h3>Студентота</h3>
                            {Array.from(selectedChat.users.entries())
                                .filter(([, user]) => user.roles.includes("student"))
                                .filter(([, user]) => !user.roles.includes("headman"))
                                .map(([id, user]) =>
                                    <p key={id}>{user.surname} {user.name} {user.middlename}</p>
                                )}
                        </>
                    }
                    {selectedChat.type === "studyGroup" &&
                        <>
                            <h3>Преподаватель</h3>
                            {Array.from(selectedChat.users.entries())
                                .filter(([, user]) => user.roles.includes("teacher"))
                                .map(([id, user]) =>
                                    <p key={id}>{user.surname} {user.name} {user.middlename}</p>
                                )}
                            <h3>Староста</h3>
                            {Array.from(selectedChat.users.entries())
                                .filter(([, user]) => user.roles.includes("headman"))
                                .map(([id, user]) =>
                                    <p key={id}>{user.surname} {user.name} {user.middlename}</p>
                                )}
                            <h3>Студентота</h3>
                            {Array.from(selectedChat.users.entries())
                                .filter(([, user]) => user.roles.includes("student"))
                                .filter(([, user]) => !user.roles.includes("headman"))
                                .map(([id, user]) =>
                                    <p key={id}>{user.surname} {user.name} {user.middlename}</p>
                                )}
                        </>
                    }
                </div>
                <div className="chat-info__footer">

                </div>
            </div>
        </div>
    );
};

export default ChatInfo;