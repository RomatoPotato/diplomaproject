import axiosInstance from "../utils/AxiosInstance";

export default class ChatService{
    static async createChat(user1Id, user2id){
        return (await (axiosInstance.post("chats", {
            user1Id,
            user2id
        }))).data;
    }

    static async getChats(userId){
        return (await (axiosInstance.get("chats/" + userId))).data;
    }

    static async getMessages(chatId){
        return (await (axiosInstance.get("chats/messages/" + chatId))).data;
    }

    static async saveMessage(text, from, to, chatId, datetime){
        return (await (axiosInstance.post("chats/messages", {
            text,
            from,
            to,
            chatId,
            datetime
        })));
    }
}