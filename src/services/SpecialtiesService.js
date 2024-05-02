import axiosInstance from "../utils/AxiosInstance";

export default class SpecialtiesService {
    static async getSpecialties(){
        return (await axiosInstance.get("specialties/")).data;
    }

    static async addSpecialty(specialtyName){
        return (await axiosInstance.post("specialties/", {
            name: specialtyName
        })).data;
    }

    static async editSpecialty(specialtyId, newSpecialtyName){
        return (await axiosInstance.put("specialties/", {
            id: specialtyId,
            newName: newSpecialtyName
        })).data;
    }

    static async deleteSpecialty(id){
        return (await axiosInstance.delete("specialties/" + id)).data;
    }
}