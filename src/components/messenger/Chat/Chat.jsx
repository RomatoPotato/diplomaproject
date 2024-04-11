import React from 'react';
import Message from "../Message/Message";
import Header from "../Header/Header";
import ChatInput from "../ChatInput/ChatInput";
import "./Chat.css";

const Chat = ({selectedContact, currentUser, onMessageSubmit, onCloseContactClick}) => {
    return (
        <div className="chat">
            {selectedContact ?
                <>
                    <Header selectedContact={selectedContact} onCloseButtonClick={onCloseContactClick}/>
                    <div className="chat__space">
                        <div className="chat__wrapper">
                            {selectedContact && selectedContact.messages.map(message => {
                                return <Message
                                    key={message.text}
                                    sender={message.fromSelf ? currentUser : selectedContact}
                                    text={message.text}
                                    self={message.fromSelf}
                                    date={message.date}/>
                            })}
                        </div>
                    </div>
                    <ChatInput onMessageSubmit={onMessageSubmit}/>
                </> :
                <div className="chat__unselected-alert-space">
                    <p>Выберите группу или собеседника</p>
                </div>
            }
        </div>
    );
};

export default Chat;