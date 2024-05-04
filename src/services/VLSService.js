import axiosInstance from "../utils/AxiosInstance";

export default class VLSService {
    static async getVLSs(){
        return (await axiosInstance.get("vlss/")).data;
    }

    static async getVLS(id){
        return (await axiosInstance.get("vlss/" + id)).data;
    }

    static async addVLS(groupId, admins){
        return (await axiosInstance.post("vlss/", {
            groupId,
            admins
        })).data;
    }

    static async editVLS(id, group){
        return (await axiosInstance.put("vlss/", {
            id,
            group
        })).data;
    }

    static async deleteVLS(id){
        return (await axiosInstance.delete("vlss/" + id)).data;
    }

    static async addStudyChats(vlsId, disciplines, teachers){
        return (await axiosInstance.post("vlss/studyChats", {
            vlsId,
            disciplines,
            teachers
        })).data;
    }
}