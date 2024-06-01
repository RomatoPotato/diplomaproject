import React, {useState} from 'react';
import "./Teachers.css";
import {Form, useLoaderData} from "react-router-dom";
import ADService from "../../services/ADService";
import TeachersService from "../../services/TeachersService";
import AdminManager from "../../utils/AdminManager";
import TextInput from "../../components/ui/TextInput/TextInput";
import BetterSelect from "../../components/ui/BetterSelect/BetterSelect";
import ImageButton from "../../components/ui/ImageButton/ImageButton";
import Button from "../../components/ui/Button/Button";
import Table, {TableActionCell, TableBody, TableCell, TableHead, TableRow} from "../../components/ui/Table/Table";
import DialogWindow from "../../components/ui/DialogWindow/DialogWindow";
import {show} from "../../utils/GlobalEventListeners/ShowModalsEventListener";

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
        <div className="teachers-page">
            <h1>Преподаватели</h1>
            <h2>Добавить</h2>
            <Form method="post" onSubmit={(e) => {
                if (!fullName || fullName.trim() === "") {
                    e.preventDefault();
                }

                setSelectedDisciplines([]);
                setFullName("");
            }}>
                <div className="form-layout">
                    <span>ФИО:&nbsp;</span>
                    <TextInput
                        icon="../static/images/user-initials.png"
                        name="fullTeacherName"
                        value={fullName}
                        onChange={(value) => setFullName(value)}/>
                    <p><b>Выберите дисциплины:</b></p>
                    <BetterSelect
                        onChange={(value) => {
                            if (value) {
                                setSelectedDisciplines([...selectedDisciplines, value]);
                            }
                        }}
                        defaultElement={{text: "Не выбрано", value: null}}
                        elements={Array.from(disciplines, ([_id, name]) => ({_id, name})).map(discipline => ({
                            text: discipline.name,
                            value: discipline._id
                        }))}/>
                </div>
                <p><b>Преподаваемые дисциплины:</b></p>
                {selectedDisciplines.length === 0 ?
                    <p><i>Пусто</i></p> :
                    <Table className="teachers-page__selected-disciplines">
                        <TableHead>
                            <TableRow>
                                <TableCell>Наименование дисциплины</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {selectedDisciplines.map(discipline =>
                                <TableRow key={discipline}>
                                    <TableActionCell text={disciplines.get(discipline)}>
                                        <input type="hidden" name="disciplines" value={discipline}/>
                                        <ImageButton
                                            className="button-table-action"
                                            src="../static/images/delete.png"
                                            onClick={() => {
                                                setSelectedDisciplines(selectedDisciplines.filter(a => a !== discipline));
                                            }}/>
                                    </TableActionCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                }
                <Button
                    disabled={!(selectedDisciplines.length > 0 && fullName !== "")}
                    type="submit">
                    Готово
                </Button>
            </Form>
            <h2>Список:</h2>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ФИО препода</TableCell>
                        <TableCell>Дисциплины</TableCell>
                        <TableCell>Действия</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {teachers.map(teacher =>
                        <TableRow key={teacher._id}>
                            <TableCell className="teachers-page__table-cell">{teacher.surname} {teacher.name} {teacher.middlename}</TableCell>
                            <TableCell className="teachers-page__table-cell">
                                <div>
                                    {teacher.disciplines.map(discipline =>
                                        <p key={discipline._id}>{discipline.name}</p>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell className="teachers-page__table-cell">
                                <ImageButton
                                    className="button-table-action"
                                    src="../static/images/gen_psw_icon.png"
                                    onClick={async () => {
                                        show("generate-psw-dialog", teacher);
                                    }} />
                                <ImageButton
                                    className="button-table-action"
                                    src="../static/images/delete.png"
                                    onClick={() => {
                                        show("delete-teacher-dialog", teacher);
                                    }}/>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <Form className="admin-modals">
                <DialogWindow
                    name="generate-psw-dialog"
                    title="Продолжить?"
                    warningText={(teacher) => `Будет сгенерирован пароль для преподавателя ${teacher?.surname} ${teacher?.name} ${teacher?.middlename}`}
                    positiveButtonClick={async (teacher) => {
                        await AdminManager.generateLoginAndPasswordForOne(teacher, teacher.userId);
                    }}/>
                <DialogWindow
                    confirmType="submit"
                    name="delete-teacher-dialog"
                    title="Удалить преподавателя?"
                    warningText={(teacher) => `Будет удалён преподаватель ${teacher?.surname} ${teacher?.name} ${teacher?.middlename}`}
                    positiveButtonClick={async (teacher) => {
                        await TeachersService.deleteTeacher(teacher._id);
                    }}/>
            </Form>
        </div>
    );
};

export default Teachers;