import axiosInstance from "../utils/AxiosInstance";

export default class TeachersService {
    static async getTeachers(){
        return (await (axiosInstance.get("teachers/"))).data;
    }

    static async addTeacher(surname, name, middlename, disciplines) {
        return (await axiosInstance.post("teachers/", {
            surname,
            name,
            middlename,
            disciplines
        }))
    }

    static async editTeacher(id, disciplines){

    }

    static async deleteTeacher(id){

    }
}