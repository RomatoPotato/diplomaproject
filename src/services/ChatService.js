import axiosInstance from "../util/AxiosInstance";

export default class ChatService{
    static async createChat(user1Id, user2id){
        return (await (axiosInstance.post("api/chats", {
            user1Id,
            user2id
        }))).data;
    }

    static async getChats(userId){
        return (await (axiosInstance.get("api/chats/" + userId))).data;
    }

    static async getMessages(chatId){
        return (await (axiosInstance.get("api/chats/messages/" + chatId))).data;
    }

    static async saveMessage(text, from, to, chatId, datetime){
        return (await (axiosInstance.post("api/chats/messages", {
            text,
            from,
            to,
            chatId,
            datetime
        })));
    }
}