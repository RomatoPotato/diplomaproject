import React, {useState} from 'react';
import "./MailingWindow.css";
import ChatsFilter from "../../messenger/ChatsFilter/ChatsFilter";
import Window from "../../ui/components/Window/Window";
import ChatInput from "../../messenger/ChatInput/ChatInput";
import ChatTabCheckbox from "../../messenger/ChatTabCheckbox/ChatTabCheckbox";
import Message from "../../messenger/Message/Message";

let messageId = 0;

const MailingWindow = ({onCloseMailingWindow, chats, currentUser, onSendMailingClick}) => {
    const [chatsArray] = useState(Array.from(chats, ([key, value]) => (value)));
    const [chatsFilter, setChatsFilter] = useState(() => (f) => f);
    const [selectAllChecked, setSelectAllChecked] = useState(false);
    const [messages, setMessages] = useState([]);
    const [checkedMap, setCheckedMap] = useState(() => {
        let map = new Map();
        for (const chat of chatsArray) {
            map.set(chat._id, false);
        }
        return map;
    });

    return (
        <Window onCloseWindow={onCloseMailingWindow} name="Создание рассылки" className="mailing-window">
            <div className="mailing-window__left-side">
                <ChatsFilter onSearchGroup={(filter) => {
                    for (const chat of chatsArray.filter(chatsFilter)) {
                        if (!checkedMap.get(chat._id)) {
                            setSelectAllChecked(false);
                            break;
                        }
                    }

                    setChatsFilter(filter);
                }}/>
                <p>
                    <label>Выбрать все:&nbsp;
                        <input
                            type="checkbox"
                            checked={selectAllChecked}
                            onChange={(e) => {
                                const checked = e.target.checked;
                                const temp = checkedMap;

                                for (let chat of chatsArray.filter(chatsFilter)) {
                                    temp.set(chat._id, checked);
                                }

                                setCheckedMap(new Map(temp));
                                setSelectAllChecked(checked);
                            }}/>
                    </label>
                </p>
                <div className="mailing-window__chats-list">
                    {chatsArray.filter(chatsFilter).map(chat =>
                        <ChatTabCheckbox
                            key={chat._id}
                            chat={chat}
                            checked={checkedMap.get(chat._id)}
                            onChange={(value) => {
                                const temp = checkedMap;
                                temp.set(chat._id, value);
                                setCheckedMap(new Map(temp));

                                if (selectAllChecked) {
                                    setSelectAllChecked(false);
                                }
                            }}/>
                    )}
                </div>
            </div>
            <div className="mailing-window__main-area">
                <div className="mailing-window__messages">
                    <div className="messages-wrap">
                        {messages.map(message =>
                            <Message
                                key={messageId++}
                                message={message}
                                messageDate={message.date}
                                self={true}/>
                        )}
                    </div>
                </div>
                <div className="mailing-window__send-area">
                    <ChatInput onMessageSubmit={(text) => {
                        setMessages([
                            ...messages,
                            {
                                text,
                                sender: currentUser,
                                datetime: new Date()
                            }
                        ]);
                    }}/>
                    <button onClick={() => {
                        onCloseMailingWindow();
                        onSendMailingClick(messages, (() => {
                            const chatIds = [];

                            for (const [id, checked] of checkedMap.entries()) {
                                if (checked) {
                                    chatIds.push(id);
                                }
                            }

                            return chatIds;
                        })());
                    }}>Готово
                    </button>
                </div>
            </div>
        </Window>
    );
};

export default MailingWindow;