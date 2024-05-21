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

    static async editMessage(messageId, text){
        return (await (axiosInstance.put("messages", {
            messageId,
            text
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

    static async deleteManyMessagesForAll(messages){
        return (await (axiosInstance.post("messages/delete-many/all", {
            messages
        })))
    }

    static async deleteManyMessagesForSelf(userId, chatId, messages){
        return (await (axiosInstance.post("messages/delete-many/self", {
            userId,
            chatId,
            messages
        })))
    }
}