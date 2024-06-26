import React, {useState} from 'react';
import "./UniversityStaff.css";
import StaffService from "../../services/StaffService";
import {Form, useLoaderData} from "react-router-dom";
import AdminManager from "../../utils/AdminManager";
import TextInput from "../../components/ui/TextInput/TextInput";
import Button from "../../components/ui/Button/Button";
import Table, {TableBody, TableCell, TableHead, TableRow} from "../../components/ui/Table/Table";
import ImageButton from "../../components/ui/ImageButton/ImageButton";
import DialogWindow from "../../components/ui/DialogWindow/DialogWindow";
import {show} from "../../utils/GlobalEventListeners/ShowModalsEventListener";
import DialogWindowForm from "../../components/ui/DialogWindowForm/DialogWindowForm";
import VLSService from "../../services/VLSService";

export async function loader() {
    return await StaffService.getStaff();
}

export async function action({request}) {
    const formData = await request.formData();
    const intent = formData.get("intent");

    switch (intent){
        case "addStaff":
            const surname = formData.get("staffSurname").trim();
            const name = formData.get("staffName").trim();
            const middlename = formData.get("staffMiddlename").trim();
            const appointment = formData.get("appointment").trim();
            return await StaffService.addStaff(surname, name, middlename, appointment);
        case "deleteStaff":
            const staffId = formData.get("staff_id");
            return await StaffService.deleteStaff(staffId);
        default:
            return null;
    }
}

const UniversityStaff = () => {
    const staff = useLoaderData();

    const [surname, setSurname] = useState("");
    const [name, setName] = useState("");
    const [middlename, setMiddlename] = useState("");
    const [appointment, setAppointment] = useState("");

    return (
        <div className="staff-page">
            <h2>Добавление сотрудника</h2>
            <Form method="post">
                <div className="form-layout">
                    <span>Фамилия:&nbsp;</span>
                    <TextInput
                        name="staffSurname"
                        value={surname}
                        onChange={(value) => setSurname(value)}/>
                    <span>Имя:&nbsp;</span>
                    <TextInput
                        name="staffName"
                        value={name}
                        onChange={(value) => setName(value)}/>
                    <span>Отчество:&nbsp;</span>
                    <TextInput
                        name="staffMiddlename"
                        value={middlename}
                        onChange={(value) => setMiddlename(value)}/>
                    <span>Должность:&nbsp;</span>
                    <TextInput
                        name="appointment"
                        value={appointment}
                        onChange={(value) => setAppointment(value)}/>
                </div>
                <Button
                    name="intent"
                    value="addStaff"
                    className="staff-page__button-add"
                    disabled={!(surname !== "" && name !== "" && middlename !== "" && appointment !== "")}
                    type="submit">
                    Добавить
                </Button>
            </Form>
            <h1>Сотрудники университета</h1>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ФИО</TableCell>
                        <TableCell>Должность</TableCell>
                        <TableCell>Действия</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {staff.map(s =>
                        <TableRow key={s._id}>
                            <TableCell>{s.surname} {s.name} {s.middlename}</TableCell>
                            <TableCell>{s.appointment}</TableCell>
                            <TableCell>
                                <ImageButton
                                    src="../static/images/gen_psw_icon.png"
                                    className="button-table-action"
                                    onClick={async () => {
                                        show("generate-psw-dialog", s);
                                    }} />
                                <ImageButton
                                    className="button-table-action"
                                    src="../static/images/delete.png"
                                    onClick={() => {
                                        show("delete-staff-dialog", s);
                                    }}/>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <div className="admin-modals">
                <DialogWindow
                    name="generate-psw-dialog"
                    title="Продолжить?"
                    warningText={(staff) => `Будет сгенерирован пароль для сотрудника ${staff?.surname} ${staff?.name} ${staff?.middlename}`}
                    positiveButtonClick={async (staff) => {
                        await AdminManager.generateLoginAndPasswordForOne(staff, staff.userId);
                    }}/>
                <DialogWindowForm
                    name="delete-staff-dialog"
                    title="Удалить сотрудника?"
                    warningText={(staff) => `Будет удалён сотрудник ${staff?.surname} ${staff?.name} ${staff?.middlename}`}
                    actions={(staff) => [
                        {name: "intent", value : "deleteStaff"},
                        {name: "staff_id", value : staff._id}
                    ]}/>
            </div>
        </div>
    );
};

export default UniversityStaff;