import axiosInstance from "../utils/AxiosInstance";

export default class UserService {
    static async getUser(login){
        return (await axiosInstance.get("api/users/" + login)).data;
    }

    static async updateLoginData(userId, login, password){
        return (await axiosInstance.post("api/users/updateLoginData", {
            userId,
            login,
            password
        }));
    }
}