import DateHelper from "./DateHelper";

class ChatsStateManager {
    addMessage(destinationChat, setChats, chats, message){
        const formattedSendDate = DateHelper.getFormattedDate(message.datetime);

        const temp = chats;
        const currentChat = temp.get(destinationChat._id);

        currentChat.lastMessage = message;
        if (!currentChat.messages.get(formattedSendDate)) {
            currentChat.messages.set(formattedSendDate, [message]);
        } else {
            currentChat.messages.get(formattedSendDate).push(message);
        }

        setChats(new Map(temp));
    }

    addManyMessages(setChats, chats, messages){
        const temp = chats;

        for (const message of messages){
            const formattedSendDate = DateHelper.getFormattedDate(message.datetime);

            const currentChat = temp.get(message.chatId);
            if (!currentChat.messages.get(formattedSendDate)){
                currentChat.messages.set(formattedSendDate, [message]);
            }else {
                currentChat.messages.get(formattedSendDate).push(message);
            }
            currentChat.lastMessage = message;
        }

        setChats(new Map(temp));
    }

    deleteMessage(setChats, chats, messageData){
        const temp = chats;
        const currentChat = temp.get(messageData.message.chatId);
        const messages = currentChat.messages.get(messageData.date).filter(msg => msg._id !== messageData.message._id);

        if (messages.length === 0) {
            currentChat.messages.delete(messageData.date);
        } else {
            currentChat.messages.set(messageData.date, messages);
        }

        if (currentChat.lastMessage._id === messageData.message._id && messages.length !== 0) {
            currentChat.lastMessage = currentChat.messages.get(messageData.date).at(-1);
        } else {
            if (Array.from(currentChat.messages).at(-1)) {
                currentChat.lastMessage = Array.from(currentChat.messages).at(-1)[1].at(-1);
            } else {
                currentChat.lastMessage = null;
            }
        }

        setChats(new Map(temp));
    }

    deleteManyMessages(setChats, chats, messagesData){
        const temp = chats;
        const currentChat = temp.get(messagesData[0].message.chatId);
        const currentChatMessages = currentChat.messages;

        for (const messageData of messagesData){
            const dateMessages = currentChatMessages.get(messageData.date).filter(msg => msg._id !== messageData.message._id);
            if (dateMessages.length === 0) currentChatMessages.delete(messageData.date);
            else currentChatMessages.set(messageData.date, dateMessages);
        }

        if (Array.from(currentChatMessages).at(-1)) {
            currentChat.lastMessage = Array.from(currentChatMessages).at(-1)[1].at(-1);
        }else {
            currentChat.lastMessage = null;
        }

        setChats(new Map(temp));
    }

    editMessage(setChats, chats, messageData, text) {
        const temp = chats;
        const currentChat = temp.get(messageData.message.chatId);

        let editedMessage;
        currentChat.messages.get(messageData.date).filter(msg => msg._id === messageData.message._id).map(msg => {
            msg.text = text;
            msg.edited = true;
            editedMessage = msg;
            return editedMessage;
        });

        if (currentChat.lastMessage._id === messageData.message._id) {
            currentChat.lastMessage = editedMessage;
        }

        setChats(new Map(temp));
    }
}

export default new ChatsStateManager();