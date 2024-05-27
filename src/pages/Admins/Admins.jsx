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
import DialogWindow from "../../components/ui/DialogWindow/DialogWindow";

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
                        <BetterSelect
                            defaultElement={{text: "Не выбрано", value: null}}
                            name="staff"
                            elements={staff.map(s => ({
                                text: `${s.surname} ${s.name} ${s.middlename}`,
                                value: s.userId
                            }))} />
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
                <Button className="button-add-admin" type="submit">Готово</Button>
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
            <Form className="admin-modals">
                <DialogWindow
                    confirmType="submit"
                    name="delete-admin-dialog"
                    title="Удалить админа?"
                    warningText={(admin) => `Вы удалите админа ${admin?.surname} ${admin?.name} ${admin?.middlename}`}
                    positiveButtonClick={async (admin) => {
                        await RolesService.removeRoleFromUser(admin._id, "admin");
                    }}/>
            </Form>
        </div>
    );
};

export default Admins;