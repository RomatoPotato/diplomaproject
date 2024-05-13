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

    static async editMessage(messageId, text){
        return (await (axiosInstance.put("messages", {
            messageId,
            text
        }))).data;
    }

    static async deleteMessageForAll(messageId){
        return (await (axiosInstance.delete("messages/" + messageId))).data;
    }

    static async deleteMessageForSelf(userId, chatId, messageId){
        return (await (axiosInstance.post("messages/" + userId, {
            chatId,
            messageId
        }))).data;
    }
}