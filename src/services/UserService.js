import axiosInstance from "../utils/AxiosInstance";

export default class UserService {
    static async getUser(login){
        return (await axiosInstance.get("users/" + login)).data;
    }

    static async addUserWithRoles(name, surname, middlename, roles){
        return (await axiosInstance.post("users/", {
            name,
            surname,
            middlename,
            roles
        })).data;
    }

    static async updateLoginData(userId, login, password){
        return (await axiosInstance.post("users/updateLoginData", {
            userId,
            login,
            password
        }));
    }

    static async generateLoginsAndPasswords(users){
        return (await axiosInstance.post("users/generate", {
            users
        })).data;
    }
}