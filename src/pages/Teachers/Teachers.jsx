import React, {useState} from 'react';
import {Form, useLoaderData} from "react-router-dom";
import ADService from "../../services/ADService";
import TeachersService from "../../services/TeachersService";
import UserService from "../../services/UserService";

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

    const added = await TeachersService.addTeacher(surname, name, middlename, disciplines);

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
                                const loginsAndPasswords = await UserService.generateLoginsAndPasswords([teacher.userId]);

                                const dataToSave = [];
                                for (const data of loginsAndPasswords) {
                                    if (data.alreadyLoggedIn) {
                                        dataToSave.push(`${data.user}\nПользователь уже входил в систему`)
                                    }
                                    else {
                                        dataToSave.push(`${data.user}\nЛогин: ${data.login}\nПароль: ${data.password}\n\n`);
                                    }
                                }

                                const file = new Blob(dataToSave, {type: "text/plain"});
                                const element = document.createElement("a");
                                element.href = URL.createObjectURL(file);
                                element.download = `${teacher.surname} ${teacher.name} ${teacher.middlename} логин и пароль.txt`;
                                element.click();
                                URL.revokeObjectURL(element.href);
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