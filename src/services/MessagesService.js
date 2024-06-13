import axiosInstance from "../utils/AxiosInstance";

export default class MessagesService {
    static async getMessages(chatId){
        return (await (axiosInstance.get("messages/" + chatId))).data;
    }

    static async saveMessage(message, to){
        return (await (axiosInstance.post("messages", {
            message,
            to,
        }))).data;
    }

    static async saveManyMessages(messages){
        return (await (axiosInstance.post("messages/many", {
            messages
        }))).data;
    }

    static async editMessage(messageId, text, attachments){
        return (await (axiosInstance.put("messages", {
            messageId,
            text,
            attachments
        }))).data;
    }

    static async deleteMessageForAll(messageId){
        return (await (axiosInstance.post("messages/delete-one/all", {
            messageId
        }))).data;
    }

    static async deleteMessageForSelf(userId, chatId, messageId){
        return (await (axiosInstance.post("messages/delete-one/self", {
            userId,
            chatId,
            messageId
        }))).data;
    }

    static async deleteManyMessagesForAll(messagesIds){
        return (await (axiosInstance.post("messages/delete-many/all", {
            messagesIds
        })));
    }

    static async deleteManyMessagesForSelf(userId, chatId, messagesIds){
        return (await (axiosInstance.post("messages/delete-many/self", {
            userId,
            chatId,
            messagesIds
        })));
    }
}