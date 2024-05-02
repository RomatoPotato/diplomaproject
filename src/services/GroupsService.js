import axiosInstance from "../utils/AxiosInstance";

export default class GroupsService {
    static async getGroups(){
        return (await axiosInstance.get("groups/")).data;
    }

    static async addGroup(year, specialty, name, students, headman, curator){
        return (await axiosInstance.post("groups/", {
            year,
            specialty,
            name,
            students,
            headman,
            curator
        })).data;
    }

    static async editGroup(){
        return (await axiosInstance.put("groups/", {

        })).data;
    }

    static async deleteGroup(id){
        return (await axiosInstance.delete("groups/" + id)).data;
    }
}