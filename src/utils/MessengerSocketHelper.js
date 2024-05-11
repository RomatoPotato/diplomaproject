import socket from "./socket";
import MessagesService from "../services/MessagesService";
import chatsStateManager from "./ChatsStateManager";

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

    async deleteMessage(messageData){
        socket.emit("delete message", messageData);
        await MessagesService.deleteMessage(messageData._id);
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
        socket.on("message", ({text, from, to, date}) => {
            let destinationChat = chats.get(to);

            const receivedMessage = {
                _id: text + new Date().getTime(),
                text: text,
                sender: destinationChat.users.get(from),
                chatId: destinationChat._id,
                datetime: date
            };

            chatsStateManager.addMessage(destinationChat, setChats, chats, receivedMessage);
        });

        socket.on("delete message", (messageData) => {
            console.log(messageData)
            chatsStateManager.deleteMessage(setChats, chats, messageData);
        });
    }

    removeMessagesListeners(){
        socket.off("message");
        socket.off("delete message");
    }

    async sendMessage(setChats, chats, selectedChat, currentUser, text){
        const sendDate = new Date();

        socket.emit("message", {
            date: sendDate,
            text: text,
            to: selectedChat._id
        });

        const newMessage = {
            _id: text + sendDate.getTime(),
            text: text,
            sender: currentUser,
            chatId: selectedChat._id,
            datetime: sendDate
        };

        chatsStateManager.addMessage(selectedChat, setChats, chats, newMessage);

        const to = selectedChat.type === "dialog" ? selectedChat.interlocutor._id : selectedChat._id;
        await MessagesService.saveMessage(text, currentUser._id, to, selectedChat._id, sendDate);
    }
}

export default new MessengerSocketHelper();