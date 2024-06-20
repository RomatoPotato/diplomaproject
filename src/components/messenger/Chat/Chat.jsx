import React, {Fragment, useContext, useState} from 'react';
import Message from "../Message/Message";
import "./Chat.css";
import DateHelper from "../../../utils/DateHelper";
import Header from "../Header/Header";
import SelectMessagesPlane from "../SelectMessagesPlane/SelectMessagesPlane";
import {show} from "../../../utils/GlobalEventListeners/ShowModalsEventListener";
import EditMessagePlane from "../EditMessagePlane/EditMessagePlane";
import UploadFilesPlane from "../UploadFilesPlane/UploadFilesPlane";
import ChatInput from "../ChatInput/ChatInput";
import {ContextMenu} from "../../ui/ContextMenu/ContextMenu";
import DialogWindow from "../../ui/DialogWindow/DialogWindow";
import DialogMenu from "../../ui/DialogMenu/DialogMenu";
import DialogAlert from "../../ui/DialogAlert/DialogAlert";
import listener from "../../../utils/GlobalEventListeners/SelectMessageEventListener";
import ChatInfo from "../ChatInfo/ChatInfo";
import socketHelper from "../../../utils/MessengerSocketHelper"
import {ChatsContext, ChatsDispatchContext} from "../../../contexts/ChatsContext";
import messengerSocketHelper from "../../../utils/MessengerSocketHelper";
import mongoose from "mongoose";
import FilesService from "../../../services/FilesService";
import MediaWindow from "../../ui/MediaWindow/MediaWindow";

const maxFileSize = 16777216; //16Mb

const Chat = ({selectedChatId, currentUser, onCloseChatClick}) => {
    const [showChatInfo, setShowChatInfo] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [editMode, setEditMode] = useState({
        enabled: false,
        message: null
    });
    const [selectMode, setSelectMode] = useState({
        enabled: false,
        messagesData: null
    });
    const dispatch = useContext(ChatsDispatchContext);
    const allChats = useContext(ChatsContext);
    const currentChat = allChats.get(selectedChatId);

    function disableEditMode() {
        setEditMode({
            enabled: false,
            message: null
        });
    }

    function disableSelectMode() {
        setSelectMode({
            enabled: false,
            messagesData: null
        });
        const eventClear = new CustomEvent("clear_selecteds");
        window.dispatchEvent(eventClear);
    }

    function generateMessagesList() {
        let lastSender = null;
        let messageDate;

        return Array.from(currentChat.messages, ([datetime, messages]) => ({datetime, messages})).map(msg => {
            lastSender = null;
            messageDate = DateHelper.getFormattedDay(msg.datetime);

            return (
                <Fragment key={msg.datetime}>
                    <p className="chat__date">{messageDate}</p>
                    {Array.from(msg.messages.values()).map(message => {
                        message = {
                            ...message,
                            self: message.sender._id === currentUser._id
                        }

                        const messageElement =
                            <Message
                                contextMenuName="chat-cm"
                                key={message._id}
                                message={message}
                                messageDate={msg.datetime}
                                lastSender={lastSender}
                                selectMode={selectMode}
                                onOpenMediaClick={(file) => show("media-window", file)}/>

                        lastSender = message.sender;

                        return messageElement;
                    })}
                </Fragment>
            )
        });
    }

    listener.register((messagesData) => {
        setSelectMode({
            enabled: true,
            messagesData
        });
    });

    async function handleSelectFilesChange(e) {
        const allFiles = [];
        const addedFiles = Object.values(e.target.files);

        e.target.value = null;

        if (addedFiles.length + selectedFiles.length > 10) {
            show("cut-files-dialog_messenger", addedFiles.slice(0, 10 - selectedFiles.length));
            return;
        }

        for (const file of addedFiles) {
            /*const type = file.type;

            if (!(type === "image/gif" || type === "image/jpeg" || type === "image/png" || type === "text/plain"
                || type === "video/mp4" || type === "application/msword" || type === "application/pdf"
                || type === "application/vnd.ms-powerpoint"
                || type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                || type === "application/vnd.visio" || type === "application/vnd.visio2013"
                || type === "application/x-compressed" || type === "application/x-7z-compressed"
                || type === "application/x-zip-compressed" || type === "application/x-rar-compressed"
                || type === "application/vnd.ms-excel")) {
                show("invalid-type-format");
                return;
            }*/

            if (file.size > maxFileSize) {
                show("too-big-file");
                return;
            }

            allFiles.push(file);
        }

        setSelectedFiles(selectedFiles.concat(allFiles));
    }

    async function handleMessageSubmit(text) {
        if (editMode.enabled) {
            disableEditMode();

            if (editMode.messageData.message.text !== text) {
                dispatch({
                    type: "messageEdited",
                    chatId: currentChat._id,
                    text,
                    messageData: editMode.messageData
                });
                await socketHelper.editMessage(editMode.messageData, text);
            }
        } else {
            let filesData = [];

            if (selectedFiles.length > 0) {
                const formData = new FormData();
                for (const file of selectedFiles) {
                    formData.append("files", file);
                }

                await FilesService.upload(formData)
                    .then((response) => {
                        filesData = response.data;
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }

            if (text.replace(/\s{2,}/g, " ").trim() !== "" || selectedFiles.length > 0) {
                const newMessage = {
                    _id: new mongoose.Types.ObjectId().toString(),
                    type: "text",
                    text: text,
                    sender: currentUser,
                    chatId: currentChat._id,
                    datetime: new Date()
                };

                if (selectedFiles.length > 0){
                    newMessage.type = "attachment";
                    newMessage.attachments = filesData;
                }

                dispatch({
                    type: "messageAdded",
                    chatId: currentChat._id,
                    message: newMessage
                });

                await socketHelper.sendMessage(currentChat, currentUser, newMessage);

                setSelectedFiles([]);
            }
        }
    }

    return (
        <div className="chat">
            <Header
                selectedChat={currentChat}
                onCloseButtonClick={() => {
                    onCloseChatClick();
                }}
                onChatInfoClick={() => setShowChatInfo(true)}/>
            {selectMode.enabled &&
                <SelectMessagesPlane
                    selectMode={selectMode}
                    onDeleteButtonClick={() => {
                        show("delete-selected-dm", selectMode.messagesData);
                    }}
                    onCloseButtonClick={() => {
                        disableSelectMode();
                    }}/>
            }
            <div className="chat__messages-list">
                <div className="chat__messages-wrapper">
                    {generateMessagesList()}
                </div>
            </div>
            {editMode.enabled &&
                <EditMessagePlane
                    message={editMode.enabled && editMode.messageData.message}
                    onCloseButtonClick={disableEditMode}/>
            }
            {selectedFiles.length > 0 &&
                <UploadFilesPlane
                    files={selectedFiles}
                    onRemoveFileClick={(file => {
                        setSelectedFiles(selectedFiles.filter(f => f !== file));
                    })}/>
            }
            <ChatInput
                source="messenger"
                onSelectFilesClick={(e) => {
                    if (selectedFiles.length >= 10) {
                        show("too-many-files-alert_messenger");
                        e.preventDefault();
                    }
                }}
                onSelectFilesChange={handleSelectFilesChange}
                onMessageSubmit={handleMessageSubmit}
                text={editMode.enabled ? editMode.messageData.message.text : ""}/>
            {showChatInfo && <ChatInfo selectedChat={currentChat} onCloseChatInfo={() => setShowChatInfo(false)}/>}
            <div className="chat__modals">
                <MediaWindow />
                <ContextMenu name="chat-cm" contextMenuItems={[
                    {
                        text: "Переслать"
                    },
                    {
                        text: "Ответить",
                        hideCondition: {
                            self: true
                        }
                    },
                    {
                        text: "Выбрать",
                        onClick(data) {
                            setSelectMode({
                                enabled: true,
                                messagesData: data
                            });
                            disableEditMode();
                            const event = new CustomEvent("select_message", {
                                detail: {
                                    messageData: data,
                                    selected: true
                                }
                            });
                            window.dispatchEvent(event);
                        }
                    },
                    {
                        text: "Копировать",
                        onClick(data) {
                            navigator.clipboard.writeText(data.message.text).then(() => console.log("Copied!\n" + data.message.text));
                        }
                    },
                    {
                        text: "Редактировать",
                        hideCondition: {
                            self: false
                        },
                        onClick(data) {
                            setEditMode({
                                enabled: true,
                                messageData: data
                            });
                        }
                    },
                    {
                        text: "Удалить у себя",
                        isDanger: true,
                        async onClick(data) {
                            show("delete-message", {
                                ...data,
                                deleteForSelf: true
                            });
                        }
                    },
                    {
                        text: "Удалить у всех",
                        hideCondition: {
                            self: false
                        },
                        isDanger: true,
                        async onClick(data) {
                            show("delete-message", {
                                ...data,
                                deleteForAll: true
                            });
                        }
                    }
                ]}/>
                <DialogWindow
                    name="delete-message"
                    title="Удалить сообщение?"
                    warningText="Сообщение будет безвозвратно удалено!"
                    positiveButtonClick={async (data) => {
                        dispatch({
                            type: "messageDeleted",
                            chatId: currentChat._id,
                            messageData: data
                        });
                        await socketHelper.deleteMessage(data, currentChat._id, currentUser._id);
                    }}/>
                <DialogMenu name="delete-selected-dm" title="Удалить выбранные сообщения?" items={[
                    {
                        text: "Удалить у себя",
                        isDanger: true,
                        async onClick() {
                            disableSelectMode();
                            dispatch({
                                type: "manyMessagesDeleted",
                                chatId: currentChat._id,
                                messagesData: selectMode.messagesData
                            });
                            await messengerSocketHelper.deleteManyMessages(currentChat._id, selectMode.messagesData, currentUser._id);
                        }
                    },
                    {
                        text: "Удалить у всех",
                        hideCondition: selectMode.messagesData?.filter(messageData => messageData.message.self === false).length > 0,
                        isDanger: true,
                        async onClick() {
                            disableSelectMode();
                            dispatch({
                                type: "manyMessagesDeleted",
                                chatId: currentChat._id,
                                messagesData: selectMode.messagesData
                            });
                            await messengerSocketHelper.deleteManyMessages(currentChat._id, selectMode.messagesData, currentUser._id, true);
                        }
                    }
                ]}/>
                <DialogWindow
                    name="cut-files-dialog_messenger"
                    title="Можно загрузить не более 10 файлов!"
                    warningText={(files) => `Будут загружены только первые ${files?.length} файла, продолжить?`}
                    positiveButtonClick={(files) => setSelectedFiles(selectedFiles.concat(files))}/>
                <DialogAlert
                    name="too-many-files-alert_messenger"
                    title="Можно загрузить не более 10 файлов!"
                    warningText="Превышен лимит!"/>
                <DialogAlert
                    name="too-big-file"
                    title="Максимальный размер файла - 16 мегабайт"
                    warningText="Превышен размер!"/>
            </div>
        </div>
    );
};

export default Chat;