import React, {useContext, useState} from 'react';
import "./MailingWindow.css";
import ChatsFilter from "../../messenger/ChatsFilter/ChatsFilter";
import Window from "../../ui/components/Window/Window";
import ChatInput from "../../messenger/ChatInput/ChatInput";
import ChatTabCheckbox from "../../messenger/ChatTabCheckbox/ChatTabCheckbox";
import Message from "../../messenger/Message/Message";
import ImageButton from "../../ui/ImageButton/ImageButton";
import {ContextMenu} from "../../ui/ContextMenu/ContextMenu";
import EditMessagePlane from "../../messenger/EditMessagePlane/EditMessagePlane";
import {show, hide} from "../../../utils/GlobalEventListeners/ShowModalsEventListener";
import DialogWindow from "../../ui/DialogWindow/DialogWindow";
import {ChatsDispatchContext} from "../../../contexts/ChatsContext";
import mongoose from "mongoose";
import socketHelper from "../../../utils/MessengerSocketHelper";
import UploadFilesPlane from "../../messenger/UploadFilesPlane/UploadFilesPlane";

const windowName = "Создание рассылки";
let newMessageId = 0;
const maxFileSize = 16777216; //16Mb

const MailingWindow = ({chats, currentUser}) => {
    const [chatsArray] = useState(Array.from(chats, ([, value]) => (value)));
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
    const [editMode, setEditMode] = useState({enabled: false, message: null});
    const [selectedFiles, setSelectedFiles] = useState([]);
    const dispatch = useContext(ChatsDispatchContext);

    async function handleSelectFilesChange(e) {
        const allFiles = [];
        const addedFiles = Object.values(e.target.files);

        e.target.value = null;

        /*if (addedFiles.length + selectedFiles.length > 10) {
            show("cut-files-dialog_messenger", addedFiles.slice(0, 10 - selectedFiles.length));
            return;
        }*/

        for (const file of addedFiles) {
            if (file.size > maxFileSize) {
                show("too-big-file");
                return;
            }

            allFiles.push(file);
        }

        setSelectedFiles(selectedFiles.concat(allFiles));
    }

    return (
        <Window name={windowName} className="mailing-window">
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
                <p className="mailing-window__select-all-box">
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
                    {messages.length === 0 &&
                        <p className="mailing-window__no-messages-block">Напишите сообщения для рассылки</p>
                    }
                    <div className="mailing-window__messages-wrap">
                        {messages.map((message, index) =>
                            <Message
                                contextMenuName="mailing-cm"
                                key={message.id}
                                message={message}
                                messageDate={message.date}
                                lastSender={index === 0 ? null : currentUser}
                                self={true}/>
                        )}
                    </div>
                    <div className="mailing-window__menus">
                        <ContextMenu name="mailing-cm" contextMenuItems={[
                            {
                                text: "Редактировать",
                                onClick(data) {
                                    setEditMode({
                                        enabled: true,
                                        message: data.message
                                    });
                                }
                            },
                            {
                                text: "Удалить сообщение",
                                isDanger: true,
                                onClick(data) {
                                    show("delete-mailing-message", {
                                        ...data,
                                        deleteForSelf: true
                                    });
                                }
                            }
                        ]}/>
                        <DialogWindow
                            name="delete-mailing-message"
                            title="Удалить сообщение?"
                            warningText="Сообщение будет безвозвратно удалено!"
                            positiveButtonClick={async (data) => {
                                setMessages(messages.filter(message => message.id !== data.message.id));
                            }}/>
                    </div>
                </div>
                {editMode.enabled &&
                    <EditMessagePlane
                        message={editMode.message}
                        onCloseButtonClick={() => setEditMode({enabled: false, message: null})}/>
                }
                {selectedFiles.length > 0 &&
                    <UploadFilesPlane
                        files={selectedFiles}
                        onRemoveFileClick={(file => {
                            setSelectedFiles(selectedFiles.filter(f => f !== file));
                        })}/>
                }
                <div className="mailing-window__send-area">
                    <ChatInput
                        source="mailing-window"
                        text={editMode.enabled ? editMode.message.text : ""}
                        onSelectFilesClick={(e) => {
                            if (selectedFiles.length >= 10) {
                                show("too-many-files-alert_messenger");
                                e.preventDefault();
                            }
                        }}
                        onSelectFilesChange={handleSelectFilesChange}
                        onMessageSubmit={(text) => {
                            if (editMode.enabled) {
                                const editMessages = messages.map(message => {
                                    if (message.id === editMode.message.id) {
                                        message.text = text;
                                    }
                                    return message;
                                });

                                setMessages(editMessages);
                                setEditMode({
                                    enabled: false,
                                    message: null
                                });
                            } else {
                                setMessages([
                                    ...messages,
                                    {
                                        text,
                                        id: newMessageId++,
                                        self: true,
                                        sender: currentUser,
                                        datetime: new Date()
                                    }
                                ]);
                            }
                        }}/>
                    <ImageButton
                        className="mailing-window__button-send-mailing"
                        src="static/images/send-mailing.png"
                        onClick={async () => {
                            const chatIds = [];
                            const sendDate = new Date();
                            const messagesForSend = [];

                            for (const [id, checked] of checkedMap.entries()) {
                                if (checked) {
                                    chatIds.push(id);
                                }
                            }

                            for (const chatId of chatIds) {
                                for (const message of messages) {
                                    messagesForSend.push({
                                        _id: new mongoose.Types.ObjectId().toString(),
                                        text: message.text,
                                        sender: currentUser,
                                        to: chatId,
                                        chatId: chatId,
                                        datetime: sendDate
                                    });
                                }
                            }

                            dispatch({
                                type: "manyMessagesAdded",
                                messages: messagesForSend
                            });
                            await socketHelper.sendMailing(currentUser, chatIds, messagesForSend);

                            setMessages([]);
                            setSelectAllChecked(false);
                            setCheckedMap(() => {
                                let map = new Map();
                                for (const chat of chatsArray) {
                                    map.set(chat._id, false);
                                }
                                return map;
                            });
                            setEditMode({enabled: false, message: null});
                            hide(windowName);
                        }}/>
                </div>
            </div>
        </Window>
    );
};

export default MailingWindow;