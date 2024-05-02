import React, {useState} from 'react';
import {Form, redirect, useLoaderData} from "react-router-dom";
import "./CreateVLS.css";
import VLSService from "../../services/VLSService";
import GroupsService from "../../services/GroupsService";
import RolesService from "../../services/RolesService";

export async function loader() {
    const groups = await GroupsService.getGroups();
    const adminsList = await RolesService.getUsersByRoles(["admin"]);

    return [groups, adminsList];
}

export async function action({request}) {
    const formData = await request.formData();
    const groupId = formData.get("groupId");
    const admins = formData.getAll("admins");

    await VLSService.addVLS(groupId, admins);

    return redirect("../virtual-learning-spaces");
}

const CreateVLS = () => {
    const [groups, adminsList] = useLoaderData();

    const [isGroupSelected, setIsGroupSelected] = useState(false);
    const [selectedGroupId, setSelectedGroupId] = useState(null);
    const [admins, setAdmins] = useState(adminsList);

    return (
        <div className="create-vls">
            <h1>Создание виртуального учебного пространства</h1>
            <Form method="post">
                <label>
                    Выберите группу:
                    <select
                        defaultValue=""
                        name="groupId"
                        onChange={(e) => {
                            setIsGroupSelected(true);
                            setSelectedGroupId(e.target.value);
                            setAdmins(adminsList);
                        }}>
                        <option disabled></option>
                        {groups.map(group =>
                            <option key={group._id} value={group._id}>{group.name}</option>
                        )}
                    </select>
                </label>
                <br/>
                {isGroupSelected &&
                    <>
                        <h2>Участники</h2>
                        <h3>Куратор</h3>
                        {groups.filter(group => group._id === selectedGroupId).map(group =>
                            <h4 key={group.curator._id}>{group.curator.surname} {group.curator.name} {group.curator.middlename}</h4>
                        )}
                        <h3>Студенты</h3>
                        <table>
                            <thead>
                            <tr>
                                <th>ФИО</th>
                            </tr>
                            </thead>
                            <tbody>
                            {groups.filter(group => group._id === selectedGroupId)[0].students.map(student =>
                                <tr key={student._id}>
                                    <td>
                                        {student.surname} {student.name}{student.middlename && ` ${student.middlename}`}
                                        {student.roles.includes("headman") &&
                                            <b><i> (Староста)</i></b>
                                        }
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                        <h3>Админы</h3>
                        <table>
                            <thead>
                            <tr>
                                <th>ФИО</th>
                            </tr>
                            </thead>
                            <tbody>
                            {admins.map(admin =>
                                <tr key={admin._id}>
                                    <td style={{display: "flex", justifyContent: "space-between"}}>
                                        <span>{admin.surname} {admin.name} {admin.middlename}</span>
                                        <input type="hidden" name="admins" value={admin._id}/>
                                        <input
                                            type="button"
                                            value="Убрать"
                                            onClick={() => {
                                                setAdmins(admins.filter(a => a._id !== admin._id));
                                            }}/>
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </>
                }
                <input type="submit" value="Готово"/>
            </Form>
        </div>
    )
        ;
};

export default CreateVLS;