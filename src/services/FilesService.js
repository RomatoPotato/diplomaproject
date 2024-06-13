import axiosInstance from "../utils/AxiosInstance";

export default class FilesService {
    static async upload(formData){
        return (await (axiosInstance.post("files/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            },/*
            onUploadProgress: progressEvent => console.log(progressEvent.loaded)*/
        })));
    }
}