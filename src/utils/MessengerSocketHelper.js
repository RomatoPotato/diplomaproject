import socket from "./socket";
import MessagesService from "../services/MessagesService";
import chatsStateManager from "./ChatsStateManager";
import mongoose from "mongoose";

class MessengerSocketHelper {
    connectUser(currentUser){
        socket.auth = {
            user: {
                _id: currentUser._id,
                name: currentUser.name,
                surname: currentUser.surname,
                online: true
            }
        };

        socket.connect();
        socket.emit("check users");
    }

    emitJoinRoom(chat){
        socket.emit("join_room", chat._id);
    }

    addUsersListeners(setChats, chats){
        socket.on("users", (users) => {
            const temp = chats;

            for (let [, value] of temp) {
                for (let user of users) {
                    if (value.type === "dialog") {
                        if (value.interlocutor._id === user._id) {
                            value.interlocutor.online = true;
                        }
                    }
                }
            }

            setChats(new Map(temp));
        });

        socket.on("user connected", (connectedUser) => {
            const temp = chats;

            for (let [, value] of temp) {
                if (value.type === "dialog") {
                    if (value.interlocutor._id === connectedUser._id) {
                        value.interlocutor.online = true;
                        setChats(new Map(temp));
                        return;
                    }
                }
            }
        });

        socket.on("user disconnected", (userId) => {
            const temp = chats;

            for (let [, value] of temp) {
                if (value.type === "dialog") {
                    if (value.interlocutor._id === userId) {
                        value.interlocutor.online = false;
                        setChats(new Map(temp));
                        return;
                    }
                }
            }
        });
    }

    removeUsersListeners(){
        socket.off("users");
        socket.off("user connected");
        socket.off("user disconnected");
    }

    addMessagesListeners(setChats, chats){
        socket.on("message", (message) => {
            let destinationChat = chats.get(message.to);

            const receivedMessage = {
                _id: message.id,
                text: message.text,
                sender: destinationChat.users.get(message.from),
                chatId: destinationChat._id,
                datetime: message.date
            };

            chatsStateManager.addMessage(destinationChat, setChats, chats, receivedMessage);
        });

        socket.on("delete message", (messageData) => {
            chatsStateManager.deleteMessage(setChats, chats, messageData);
        });

        socket.on("delete messages", (messagesData) => {
            chatsStateManager.deleteManyMessages(setChats, chats, messagesData);
        });

        socket.on("edit message", ({messageData, text}) => {
            chatsStateManager.editMessage(setChats, chats, messageData, text);
        });
    }

    removeMessagesListeners(){
        socket.off("message");
        socket.off("delete message");
        socket.off("delete messages");
        socket.off("edit message");
    }

    async sendMessage(setChats, chats, selectedChat, currentUser, text){
        const sendDate = new Date();
        const newMessageId = new mongoose.Types.ObjectId().toString();

        socket.emit("message", {
            id: newMessageId,
            date: sendDate,
            text: text,
            to: selectedChat._id
        });

        const newMessage = {
            _id: newMessageId,
            text: text,
            sender: currentUser,
            chatId: selectedChat._id,
            datetime: sendDate
        };

        chatsStateManager.addMessage(selectedChat, setChats, chats, newMessage);

        const to = selectedChat.type === "dialog" ? selectedChat.interlocutor._id : selectedChat._id;
        await MessagesService.saveMessage(newMessage, to);
    }

    async deleteMessage(selectedChat, messageData, deletedUserId){
        if (messageData.deleteForAll) {
            socket.emit("delete message", messageData);
            await MessagesService.deleteMessageForAll(messageData.message._id);
        }
        if (messageData.deleteForSelf){
            await MessagesService.deleteMessageForSelf(deletedUserId, selectedChat._id, messageData.message._id);
        }
    }

    async deleteManyMessages(selectedChat, messagesData, deletedUserId, deleteForAll = false){
        const messages = [];
        for (const messageData of messagesData){
            messages.push(messageData.message);
        }

        if (deleteForAll){
            socket.emit("delete messages", messagesData);
            await MessagesService.deleteManyMessagesForAll(messages);
        }else {
            await MessagesService.deleteManyMessagesForSelf(deletedUserId, selectedChat._id, messages);
        }

    }

    async editMessage(messageData, text){
        socket.emit("edit message", {
            messageData,
            text
        });
        await MessagesService.editMessage(messageData.message._id, text);
    }
}

export default new MessengerSocketHelper();