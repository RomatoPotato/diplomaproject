import axiosInstance from "../util/AxiosInstance";

export default class UserService {
    static async getUsers(){
        return (await axiosInstance.get("api/users")).data;
    }

    static async getUser(userId){
        return (await axiosInstance.get("api/users/" + userId)).data;
    }
}