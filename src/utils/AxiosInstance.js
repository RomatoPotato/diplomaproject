import axios from "axios";
import config from "../config";

const { host, port } = config.server;

const instance = axios.create({
    withCredentials: true,
    baseURL: `${host}:${port}`
});

instance.interceptors.request.use((axiosRequestConfig) => {
    axiosRequestConfig.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;

    return axiosRequestConfig;
}, (error) => {
    console.log(error);
});

export default instance;