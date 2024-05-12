import React, {useState} from 'react';
import StaffService from "../../services/StaffService";
import {Form, useLoaderData} from "react-router-dom";
import UserService from "../../services/UserService";
import FilesManager from "../../utils/FilesManager";
import AdminManager from "../../utils/AdminManager";

export async function loader() {
    return await StaffService.getStaff();
}

export async function action({request}) {
    const formData = await request.formData();
    const surname = formData.get("staffSurname").trim();
    const name = formData.get("staffName").trim();
    const middlename = formData.get("staffMiddlename").trim();
    const appointment = formData.get("appointment").trim();

    return await StaffService.addStaff(surname, name, middlename, appointment);
}

const UniversityStaff = () => {
    const staff = useLoaderData();

    const [surname, setSurname] = useState("");
    const [name, setName] = useState("");
    const [middlename, setMiddlename] = useState("");
    const [appointment, setAppointment] = useState("");

    return (
        <div>
            <h2>Добавление сотрудника</h2>
            <Form method="post" onSubmit={(e) => {
                if (surname !== "" && name !== "" && middlename !== "" && appointment !== "") {
                    setSurname("");
                    setName("");
                    setMiddlename("");
                    setAppointment("");
                }else {
                    e.preventDefault();
                }
            }}>
                <label>Фамилия:&nbsp;
                    <input
                        name="staffSurname"
                        value={surname}
                        onChange={(e) => setSurname(e.target.value)}/>
                </label>
                <br/>
                <label>Имя:&nbsp;
                    <input
                        name="staffName"
                        value={name}
                        onChange={(e) => setName(e.target.value)}/>
                </label>
                <br/>
                <label>Отчество:&nbsp;
                    <input
                        name="staffMiddlename"
                        value={middlename}
                        onChange={(e) => setMiddlename(e.target.value)}/>
                </label>
                <br/>
                <label>Должность:&nbsp;
                    <input
                        name="appointment"
                        value={appointment}
                        onChange={(e) => setAppointment(e.target.value)}/>
                </label>
                <br/>
                <input type="submit" value="Добавить"/>
            </Form>
            <br/>
            <h1>Сотрудники университета</h1>
            <table>
                <thead>
                <tr>
                    <th>ФИО</th>
                    <th>Должность</th>
                    <th>Действия</th>
                </tr>
                </thead>
                <tbody>
                {staff.map(s =>
                    <tr key={s._id}>
                        <td>{s.surname} {s.name} {s.middlename}</td>
                        <td>{s.appointment}</td>
                        <td>
                            <button onClick={async () => {
                                await AdminManager.generateLoginAndPasswordForOne(s, s.userId);
                            }}>Сгенерировать пароль</button>
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default UniversityStaff;