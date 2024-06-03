import React, {Fragment, useEffect, useState} from 'react';
import Message from "../Message/Message";
import "./Chat.css";
import DateHelper from "../../../utils/DateHelper";

const Chat = ({selectedChat, currentUser, selectMode}) => {
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
        messageDate = DateHelper.getFormattedDay(msg.datetime);

        return (
            <Fragment key={msg.datetime}>
                <p className="chat__date">{messageDate}</p>
                {
                    Array.from(msg.messages.values()).map(message => {
                        message = {
                            ...message,
                            self: message.sender._id === currentUser._id
                        }

                        const m =
                            <Message
                                contextMenuName="chat-cm"
                                key={message._id}
                                message={message}
                                messageDate={msg.datetime}
                                lastSender={lastSender}
                                selectMode={selectMode}/>

                        lastSender = message.sender;

                        return m;
                    })
                }
            </Fragment>
        )
    });

    return (
        <div className="chat">
            <div className="chat__wrapper">
                {msgs}
            </div>
        </div>
    );
};

export default Chat;