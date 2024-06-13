import axios from "axios";
import config from "../config";

const serverURL = config.server.url;

const instance = axios.create({
    withCredentials: true,
    baseURL: `${serverURL}/api`
});

instance.interceptors.request.use((axiosRequestConfig) => {
    axiosRequestConfig.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;

    return axiosRequestConfig;
}, (error) => {
    console.log(error);
});

export default instance;