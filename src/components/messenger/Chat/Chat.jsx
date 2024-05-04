import React, {Fragment, useEffect, useState} from 'react';
import Message from "../Message/Message";
import Header from "../Header/Header";
import ChatInput from "../ChatInput/ChatInput";
import "./Chat.css";
import DateHelper from "../../../utils/DateHelper";

const Chat = ({selectedChat, currentUser, onMessageSubmit, onCloseChatClick, onShowChatInfoClick}) => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (selectedChat) {
            setMessages(selectedChat.messages);
        }
    }, [selectedChat]);

    return (
        <div className="chat">
            {selectedChat ?
                <>
                    <Header
                        selectedChat={selectedChat}
                        onCloseButtonClick={onCloseChatClick}
                        onChatInfoClick={onShowChatInfoClick}/>
                    <div className="chat__space">
                        <div className="chat__wrapper">
                            {Array.from(messages, ([datetime, messages]) => ({datetime, messages})).map(msg =>
                                <Fragment key={msg.datetime}>
                                    <h2 style={{textAlign: "center"}}><b><i>{DateHelper.getDayMonth(msg.datetime)}</i></b></h2>
                                    {
                                        msg.messages.map(message => {
                                            return <Message
                                                key={message._id}
                                                sender={message.sender}
                                                text={message.text}
                                                self={message.sender._id === currentUser._id}
                                                date={message.datetime}/>
                                        })
                                    }
                                </Fragment>
                            )}
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