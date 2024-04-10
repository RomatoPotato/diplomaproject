/*
    Educational Institute Service - сервис для управления всем связанным с учебным заведением функционалом
 */

import axiosInstance from "../util/AxiosInstance";

const apiEIPath = "api/ei/"
const specialtiesRoute = apiEIPath + "specialties/";
const groupsRoute = apiEIPath + "groups/";
const vlssRoute = apiEIPath + "vlss/";

export default class EIService {
    static async getSpecialties(){
        return (await axiosInstance.get(specialtiesRoute)).data;
    }

    static async addSpecialty(specialtyName){
        return (await axiosInstance.post(specialtiesRoute, {
            name: specialtyName
        })).data;
    }

    static async editSpecialty(specialtyId, newSpecialtyName){
        return (await axiosInstance.put(specialtiesRoute, {
            id: specialtyId,
            newName: newSpecialtyName
        })).data;
    }

    static async deleteSpecialty(id){
        return (await axiosInstance.delete(specialtiesRoute + id)).data;
    }

    static async getGroups(){
        return (await axiosInstance.get(groupsRoute)).data;
    }

    static async addGroup(year, specialty, name, students){
        return (await axiosInstance.post(groupsRoute, {
            year,
            specialty,
            name,
            students
        })).data;
    }

    static async editGroup(){
        return (await axiosInstance.put(groupsRoute, {

        })).data;
    }

    static async deleteGroup(id){
        return (await axiosInstance.delete(groupsRoute + id)).data;
    }

    static async getVLSs(){
        return (await axiosInstance.get(vlssRoute)).data;
    }

    static async addVLS(group){
        return (await axiosInstance.post(vlssRoute, {
            group
        })).data;
    }

    static async editVLS(id, group){
        return (await axiosInstance.put(vlssRoute, {
            id,
            group
        })).data;
    }

    static async deleteVLS(id){
        return (await axiosInstance.delete(vlssRoute + id)).data;
    }

    static async generatePasswords(groupId){
        return (await axiosInstance.get(apiEIPath + "generatePasswords/" + groupId)).data;
    }
}