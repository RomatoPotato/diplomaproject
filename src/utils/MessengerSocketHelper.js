import socket from "./socket";
import MessagesService from "../services/MessagesService";

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

    async sendMessage(currentChat, currentUser, newMessage){
        socket.emit("message", {
            id: newMessage._id,
            from: currentUser._id,
            date: newMessage.datetime,
            text: newMessage.text,
            to: currentChat._id,
            type: newMessage.type,
            attachments: newMessage.attachments
        });

        const to = currentChat.type === "dialog" ? currentChat.interlocutor._id : currentChat._id;
        await MessagesService.saveMessage(newMessage, to);
    }

    async sendMailing(currentUser, chatIds, messagesForSend){
        socket.emit("mailing", {
            chats: chatIds,
            messages: messagesForSend
        });

        await MessagesService.saveManyMessages(messagesForSend);
    }

    async deleteMessage(messageData, currentChatId, deletedUserId){
        if (messageData.deleteForAll) {
            socket.emit("delete message", messageData);
            await MessagesService.deleteMessageForAll(messageData.message._id);
        }
        if (messageData.deleteForSelf){
            await MessagesService.deleteMessageForSelf(deletedUserId, currentChatId, messageData.message._id);
        }
    }

    async deleteManyMessages(currentChatId, messagesData, deletedUserId, deleteForAll = false){
        const messagesIds = [];
        for (const messageData of messagesData){
            messagesIds.push(messageData.message._id);
        }

        if (deleteForAll){
            socket.emit("delete messages", messagesData);
            await MessagesService.deleteManyMessagesForAll(messagesIds);
        }else {
            await MessagesService.deleteManyMessagesForSelf(deletedUserId, currentChatId, messagesIds);
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