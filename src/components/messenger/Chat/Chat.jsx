import React, {Fragment, useEffect, useRef, useState} from 'react';
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

    let lastSender = null;
    let messageDate;
    const msgs = Array.from(messages, ([datetime, messages]) => ({datetime, messages})).map(msg => {
            lastSender = null;
            messageDate = DateHelper.getDayMonth(msg.datetime);

            return <Fragment key={msg.datetime}>
                <p className="chat__date">{messageDate}</p>
                {
                    Array.from(msg.messages.values()).map(message => {
                        const m =
                            <Message
                                key={message._id}
                                message={message}
                                messageDate={msg.datetime}
                                lastSender={lastSender}
                                self={message.sender._id === currentUser._id} />

                        lastSender = message.sender;

                        return m;
                    })
                }
            </Fragment>
        }
    )

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
                            {msgs}
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