import axiosInstance from "../utils/AxiosInstance";

export default class CurriculumService {
    static async getAllCurriculums(){
        return (await axiosInstance.get("curriculums")).data;
    }

    static async getCurriculum(groupId){
        return (await axiosInstance.get("curriculums/" + groupId)).data;
    }

    static async checkCurriculum(groupId){
        return (await axiosInstance.get("curriculums/check/" + groupId)).data;
    }

    static async addCurriculum(group, academicStartYear, semestersNumber, disciplines, teachers, counts){
        return (await axiosInstance.post("curriculums", {
            group,
            academicStartYear,
            semestersNumber,
            disciplines,
            teachers,
            counts
        })).data;
    }

    static async editCurriculum(id, group, academicStartYear, semestersNumber, disciplines, teachers){
        return (await axiosInstance.put("curriculums", {
            id,
            group,
            academicStartYear,
            semestersNumber,
            disciplines,
            teachers
        })).data;
    }

    static async deleteCurriculum(id){
        return (await axiosInstance.delete("curriculums/" + id)).data;
    }
}