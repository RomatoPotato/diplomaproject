import axiosInstance from "../utils/AxiosInstance";

export default class AuthService {
    static async login(login, password){
        return (await axiosInstance.post("api/users/login", {
            login,
            password
        }));
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