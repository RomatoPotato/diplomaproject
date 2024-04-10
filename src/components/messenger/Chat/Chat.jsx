import React from 'react';
import Message from "../Message/Message";

const Chat = () => {
    const selectedUser = {};
    const currentUser = {};

    return (
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
    );
};

export default Chat;