import axiosInstance from "../utils/AxiosInstance";

export default class GroupsService {
    static async getGroups(){
        return (await axiosInstance.get("groups/")).data;
    }

    static async getGroup(id){
        return (await axiosInstance.get("groups/" + id)).data;
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

    static async addStudent(groupId, name, surname, middlename){
        return (await axiosInstance.put("groups/" + groupId, {
            name,
            surname,
            middlename
        })).data;
    }

    static async deleteStudent(groupId, studentId){
        return (await axiosInstance.post("groups/" + groupId, {
            studentId
        })).data;
    }
}