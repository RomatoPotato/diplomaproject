import React, {useState} from 'react';
import {Form, useLoaderData} from "react-router-dom";
import ADService from "../../services/ADService";
import TeachersService from "../../services/TeachersService";
import UserService from "../../services/UserService";
import FilesManager from "../../utils/FilesManager";
import AdminManager from "../../utils/AdminManager";

export async function loader() {
    const disciplines = await ADService.getAcademicDisciplines();
    const disciplinesMap = new Map();

    for (let discipline of disciplines) {
        disciplinesMap.set(discipline._id, discipline.name);
    }

    const teachers = await TeachersService.getTeachers();

    return [disciplinesMap, teachers];
}

export async function action({request}) {
    const formData = await request.formData();

    const [surname, name, middlename] = formData.get("fullTeacherName").split(" ");
    const disciplines = formData.getAll("disciplines");

    await TeachersService.addTeacher(surname, name, middlename, disciplines);

    return null;
}

const Teachers = () => {
    const [disciplines, teachers] = useLoaderData();

    const [fullName, setFullName] = useState("");
    const [selectedDisciplines, setSelectedDisciplines] = useState([]);

    return (
        <div>
            <h1>Преподаватели</h1>
            <h2>Добавить</h2>
            <Form method="post" onSubmit={() => {
                setSelectedDisciplines([]);
                setFullName("");
            }}>
                <label>ФИО:&nbsp;
                    <input
                        name="fullTeacherName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}/>
                </label>
                <p><b>Выберите дисциплины:</b></p>
                <select onChange={(e) => {
                    setSelectedDisciplines([...selectedDisciplines, e.target.value]);
                }}>
                    <option disabled selected></option>
                    {Array.from(disciplines, ([_id, name]) => ({_id, name})).map(discipline =>
                        <option key={discipline._id} value={discipline._id}>{discipline.name}</option>
                    )}
                </select>
                <p><b>Преподаваемые дисциплины:</b></p>
                {
                    selectedDisciplines.map(discipline =>
                        <p key={discipline}>👉{disciplines.get(discipline)}
                            <input type="hidden" name="disciplines" value={discipline}/>
                            <input
                                type="button"
                                value="❌"
                                onClick={() => {
                                    setSelectedDisciplines(selectedDisciplines.filter(a => a !== discipline));
                                }}/>
                        </p>
                    )
                }
                <input type="submit" value="Готово"/>
            </Form>
            <h2>Список:</h2>
            <table>
                <thead>
                <tr>
                    <th>ФИО препода</th>
                    <th>Дисциплины</th>
                    <th>Действия</th>
                </tr>
                </thead>
                <tbody>
                {teachers.map(teacher =>
                    <tr key={teacher._id}>
                        <td>{teacher.surname} {teacher.name} {teacher.middlename}</td>
                        <td>
                            {teacher.disciplines.map(discipline =>
                                <p>{discipline.name}</p>
                            )}
                        </td>
                        <td>
                            <button onClick={async () => {
                                await AdminManager.generateLoginAndPasswordForOne(teacher, teacher.userId);
                            }}>Сгенерировать пароль</button>
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default Teachers;