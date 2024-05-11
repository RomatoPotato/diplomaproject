class ChatsStateManager {
    addMessage(destinationChat, setChats, chats, message){
        const formattedSendDate = new Date(message.datetime).toLocaleDateString("ru-RU", {
            day: "numeric",
            month: "numeric",
            year: "numeric"
        });

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

    deleteMessage(setChats, chats, messageData){
        const temp = chats;
        const currentChat = temp.get(messageData.chatId);
        const messages = currentChat.messages.get(messageData.date).filter(msg => msg._id !== messageData._id);

        if (messages.length === 0) {
            currentChat.messages.delete(messageData.date);
        } else {
            currentChat.messages.set(messageData.date, messages);
        }

        if (currentChat.lastMessage._id === messageData._id && messages.length !== 0) {
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
}

export default new ChatsStateManager();