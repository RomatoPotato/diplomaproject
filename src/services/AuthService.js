import axiosInstance from "../utils/AxiosInstance";

export default class AuthService {
    static async login(login, password){
        return (await axiosInstance.post("users/login", {
            login,
            password
        }));
    }

    static async logout(){
        return (await axiosInstance.post("users/logout")).data;
    }

    static async checkAuth(){
        try {
            return (await axiosInstance.post("users/checkAuth")).data;
        }catch (err){
            return null;
        }
    }
}