import axiosInstance from "../util/AxiosInstance";

export default class AuthService {
    static async login(login, password){
        return (await axiosInstance.post("api/users/login", {
            login,
            password
        })).data;
    }

    static async logout(){
        return (await axiosInstance.post("api/users/logout")).data;
    }

    static async checkAuth(){
        try {
            return (await axiosInstance.post("api/users/checkAuth")).data;
        }catch (err){
            return null;
        }
    }
}