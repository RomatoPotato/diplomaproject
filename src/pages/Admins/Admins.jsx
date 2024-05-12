import React, {useState} from 'react';
import {Form, useLoaderData} from "react-router-dom";
import StaffService from "../../services/StaffService";
import TeachersService from "../../services/TeachersService";
import RolesService from "../../services/RolesService";

export async function loader() {
    const staff = await StaffService.getStaff();
    const teachers = await TeachersService.getTeachers();
    const admins = await RolesService.getUsersByRoles(["admin"]);

    return [staff, teachers, admins];
}

export async function action({request}) {
    const formData = await request.formData();
    const addingMethod = formData.get("addingMethod");

    switch (addingMethod) {
        case "fromStaff":
            const staffId = formData.get("staff");
            return await RolesService.addRoleToUser(staffId, "admin");
        case "fromTeachers":
            const teacherId = formData.get("teacher");
            return await RolesService.addRoleToUser(teacherId, "admin");
        default:
            return null;
    }
}

const Admins = () => {
    const [addingMethod, setAddingMethod] = useState("fromStaff");
    const [staff, teachers, admins] = useLoaderData();

    const [addingName, setAddingName] = useState("");
    const [addingSurname, setAddingSurname] = useState("");
    const [addingMiddlename, setAddingMiddlename] = useState("");

    return (
        <div>
            <h1>Админы</h1>
            <h2>Добавить</h2>
            <Form method="post" onSubmit={(e) => {
                if (addingMethod === "fromCreating") {
                    if (addingName !== "" && addingSurname !== "" && addingMiddlename !== "") {
                        setAddingName("");
                        setAddingSurname("");
                        setAddingMiddlename("");
                    }else {
                        e.preventDefault();
                    }
                }
            }}>
                <label>Выбрать из сотрудников университета:&nbsp;
                    <input
                        type="radio"
                        name="addingMethod"
                        checked={addingMethod === "fromStaff"}
                        value="fromStaff"
                        onChange={(e) => setAddingMethod(e.target.value)}/>
                </label>
                <br/>
                <label>Выбрать из учительского состава:&nbsp;
                    <input
                        type="radio"
                        name="addingMethod"
                        checked={addingMethod === "fromTeachers"}
                        value="fromTeachers"
                        onChange={(e) => setAddingMethod(e.target.value)}/>
                </label>
                <br/>
                {addingMethod === "fromStaff" &&
                    <div>
                        <select defaultValue="" name="staff">
                            <option disabled></option>
                            {staff.map(s =>
                                <option key={s._id} value={s.userId}>
                                    {s.surname} {s.name} {s.middlename}
                                </option>
                            )}
                        </select>
                    </div>
                }
                {addingMethod === "fromTeachers" &&
                    <div>
                        <select defaultValue="" name="teacher">
                            <option disabled></option>
                            {teachers.map(teacher =>
                                <option key={teacher._id} value={teacher.userId}>
                                    {teacher.surname} {teacher.name} {teacher.middlename}
                                </option>
                            )}
                        </select>
                    </div>
                }
                <input type="submit" value="Готово"/>
            </Form>
            <h2>Админы</h2>
            <table>
                <thead>
                    <tr>
                        <th>ФИО</th>
                    </tr>
                </thead>
                <tbody>
                {admins.map(admin =>
                    <tr key={admin._id}>
                        <td>{admin.surname} {admin.name} {admin.middlename}</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default Admins;