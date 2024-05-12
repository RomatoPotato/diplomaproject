import axiosInstance from "../utils/AxiosInstance";

export default class MessagesService {
    static async getMessages(chatId){
        return (await (axiosInstance.get("messages/" + chatId))).data;
    }

    static async saveMessage(text, from, to, chatId, datetime){
        return (await (axiosInstance.post("messages", {
            text,
            from,
            to,
            chatId,
            datetime
        }))).data;
    }

    static async editMessage(messageId, text){
        return (await (axiosInstance.put("messages", {
            messageId,
            text
        }))).data;
    }

    static async deleteMessage(messageId){
        return (await (axiosInstance.delete("messages/" + messageId))).data;
    }
}