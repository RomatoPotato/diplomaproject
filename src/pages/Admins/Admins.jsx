import React, {useState} from 'react';
import "./Admins.css";
import {Form, useLoaderData} from "react-router-dom";
import StaffService from "../../services/StaffService";
import TeachersService from "../../services/TeachersService";
import RolesService from "../../services/RolesService";
import BetterSelect from "../../components/ui/BetterSelect/BetterSelect";
import Button from "../../components/ui/Button/Button";
import Table, {TableActionCell, TableBody, TableCell, TableHead, TableRow} from "../../components/ui/Table/Table";
import {show} from "../../utils/GlobalEventListeners/ShowModalsEventListener";
import ImageButton from "../../components/ui/ImageButton/ImageButton";
import DialogWindowForm from "../../components/ui/DialogWindowForm/DialogWindowForm";

export async function loader() {
    const staff = await StaffService.getStaff();
    const teachers = await TeachersService.getTeachers();
    const admins = await RolesService.getUsersByRoles(["admin"]);

    return [staff, teachers, admins];
}

export async function action({request}) {
    const formData = await request.formData();
    const intent = formData.get("intent");
    const addingMethod = formData.get("addingMethod");

    switch (intent) {
        case "addAdmin":
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
        case "deleteAdmin":
            const adminId = formData.get("admin_id");
            return await RolesService.removeRoleFromUser(adminId, "admin");
        default:
            return null;
    }
}

const Admins = () => {
    const [addingMethod, setAddingMethod] = useState("fromStaff");
    const [staff, teachers, admins] = useLoaderData();

    return (
        <div>
            <h1>Админы</h1>
            <h2>Добавить</h2>
            <Form method="post">
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
                        <BetterSelect
                            defaultElement={{text: "Не выбрано", value: null}}
                            name="staff"
                            elements={staff.map(s => ({
                                text: `${s.surname} ${s.name} ${s.middlename}`,
                                value: s.userId
                            }))}/>
                    </div>
                }
                {addingMethod === "fromTeachers" &&
                    <div>
                        <BetterSelect
                            defaultElement={{text: "Не выбрано", value: null}}
                            name="teacher"
                            elements={teachers.map(teacher => ({
                                text: `${teacher.surname} ${teacher.name} ${teacher.middlename}`,
                                value: teacher.userId
                            }))}/>
                    </div>
                }
                <Button
                    name="intent"
                    value="addAdmin"
                    className="button-add-admin"
                    type="submit">
                    Готово
                </Button>
            </Form>
            <h2>Список администраторов</h2>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ФИО</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {admins.map(admin =>
                        <TableRow key={admin._id}>
                            <TableActionCell text={`${admin.surname} ${admin.name} ${admin.middlename}`}>
                                <ImageButton
                                    className="button-table-action"
                                    src="../static/images/delete.png"
                                    onClick={() => {
                                        show("delete-admin-dialog", admin);
                                    }}/>
                            </TableActionCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <div className="admin-modals">
                <DialogWindowForm
                    name="delete-admin-dialog"
                    title="Удалить админа?"
                    warningText={(admin) => `Вы удалите админа ${admin?.surname} ${admin?.name} ${admin?.middlename}`}
                    actions={(admin) => [
                        {name: "intent", value : "deleteAdmin"},
                        {name: "admin_id", value : admin._id}
                    ]}/>
            </div>
        </div>
    );
};

export default Admins;