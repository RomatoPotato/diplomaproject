import axiosInstance from "../utils/AxiosInstance";

export default class StaffService {
    static async getStaff(){
        return (await (axiosInstance.get("staff/"))).data;
    }

    static async addStaff(surname, name, middlename, appointment) {
        return (await axiosInstance.post("staff/", {
            surname,
            name,
            middlename,
            appointment
        }))
    }

    static async editStaff(id, appointment){

    }

    static async deleteStaff(id){
        return (await axiosInstance.delete("staff/" + id)).data;
    }
}