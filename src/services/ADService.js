import axiosInstance from "../utils/AxiosInstance";

export default class ADService {
    static async getAcademicDisciplines(){
        return (await axiosInstance.get("academicDisciplines/")).data;
    }

    static async addAcademicDiscipline(name){
        return (await axiosInstance.post("academicDisciplines/", {
            name
        })).data;
    }

    static async editAcademicDiscipline(id, name){
        return (await axiosInstance.put("academicDisciplines/", {
            id,
            name
        })).data;
    }

    static async deleteAcademicDiscipline(id){
        return (await axiosInstance.delete("academicDisciplines/" + id)).data;
    }
}