import axiosInstance from "../utils/AxiosInstance";

export default class RolesService {
    static async getUsersByRoles(roles){
        const rolesParamsArray = [];
        roles.forEach(role => rolesParamsArray.push(["roles", role]));
        const params = new URLSearchParams(rolesParamsArray);

        return (await axiosInstance.get("roles", {params})).data;
    }

    static async addRoleToUser(userId, role){
        return (await axiosInstance.post("roles", {
            userId,
            role
        })).data;
    }

    static async changeUserRole(userId, oldRole, newRole){
        return (await axiosInstance.put("roles", {
            userId,
            oldRole,
            newRole
        }))
    }

    static async removeRoleFromUser(userId, role){
        return (await axiosInstance.delete("roles/" + role + "/" + userId)).data;
    }
}