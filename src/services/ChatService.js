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
}