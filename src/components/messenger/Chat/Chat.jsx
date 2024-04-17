import React, {useEffect, useState} from 'react';
import Message from "../Message/Message";
import Header from "../Header/Header";
import ChatInput from "../ChatInput/ChatInput";
import "./Chat.css";
import ChatService from "../../../services/ChatService";

const Chat = ({ selectedChat, currentUser, onMessageSubmit, onCloseContactClick}) => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (selectedChat) {
            setMessages(selectedChat.messages);
        }
    }, [selectedChat]);

    return (
        <div className="chat">
            {/*selectedContact ?
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
                </> :*/}
            {selectedChat ?
                <>
                    <Header selectedChat={selectedChat} onCloseButtonClick={onCloseContactClick}/>
                    <div className="chat__space">
                        <div className="chat__wrapper">
                            {/*{selectedChat && selectedChat.messages.map(message => {
                                return <Message
                                    key={message.text}
                                    sender={message.fromSelf && currentUser}
                                    text={message.text}
                                    self={message.fromSelf}
                                    date={message.date}/>
                            })}*/}
                            {
                                messages.map(message => {
                                    return <Message
                                        key={message._id}
                                        sender={message.sender}
                                        text={message.text}
                                        self={message.sender._id === currentUser._id}
                                        date={message.datetime}/>
                                })
                            }
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