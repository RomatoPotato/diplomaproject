import UserService from "../services/UserService";
import FilesManager from "./FilesManager";

export default class AdminManager {
    static async generateLoginAndPasswordForOne(user, userId){
        const dataToSave = await generateLoginAndPassword([userId]);
        FilesManager.save(dataToSave, `${user.surname} ${user.name}${user.middlename ? user.middlename : ""} логин и пароль.txt`)
    }

    static async generateLoginAndPasswordForMany(userIds, fileName){
        let dataToSave = [];
        for (const userId of userIds){
            const s = await generateLoginAndPassword([userId]);
            dataToSave = dataToSave.concat(s);
        }
        FilesManager.save(dataToSave, fileName);
    }


}

async function generateLoginAndPassword(userIds){
    const loginsAndPasswords = await UserService.generateLoginsAndPasswords(userIds);

    const dataToSave = [];
    for (const data of loginsAndPasswords) {
        if (data.alreadyLoggedIn) {
            dataToSave.push(`${data.user}\nПользователь уже входил в систему\n\n`)
        }
        else {
            dataToSave.push(`${data.user}\nЛогин: ${data.login}\nПароль: ${data.password}\n\n`);
        }
    }

    return dataToSave;
}