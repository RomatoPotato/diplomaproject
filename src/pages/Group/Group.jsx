import React, {useRef, useState} from 'react';
import "./Group.css";
import GroupsService from "../../services/GroupsService";
import {Form, useLoaderData} from "react-router-dom";
import Table, {TableActionCell, TableBody, TableCell, TableHead, TableRow} from "../../components/ui/Table/Table";
import ImageButton from "../../components/ui/ImageButton/ImageButton";
import {show} from "../../utils/GlobalEventListeners/ShowModalsEventListener";
import DialogWindow from "../../components/ui/DialogWindow/DialogWindow";
import TextInput from "../../components/ui/TextInput/TextInput";
import Button from "../../components/ui/Button/Button";
import RolesService from "../../services/RolesService";

export async function loader({params}) {
    return await GroupsService.getGroup(params.id);
}

export async function action({request}) {
    const formData = await request.formData();
    const intent = formData.get("intent");

    switch (intent) {
        case "add":
            const name = formData.get("student_name");
            const surname = formData.get("student_surname");
            const middlename = formData.get("student_middlename");
            const group = formData.get("group");

            await GroupsService.addStudent(group, name, surname, middlename);
            break;
        default:
            return null;
    }

    return null;
}

const Group = () => {
    const group = useLoaderData();
    const headman = group.students.filter(student => student.roles.includes("headman"))[0];

    return (
        <div className="group-page">
            <h1>Группа {group.name}</h1>
            <h2>Основная информация</h2>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell>Данные</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell>Курс</TableCell>
                        <TableCell>{group.year}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Специальность</TableCell>
                        <TableCell>{group.specialty.name}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Куратор</TableCell>
                        <TableCell>{group.curator.surname} {group.curator.name} {group.curator.middlename}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <h2>Студенты</h2>
            <h3>Добавить</h3>
            <AddStudent group={group}/>
            <h3>Список студентов</h3>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ФИО</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {group.students.map(student =>
                        <TableRow key={student._id}>
                            <TableActionCell text={
                                <span>
                                    {student.surname} {student.name} {student.middlename}
                                    {student.roles.includes("headman") && <b><i>&nbsp;(Староста)</i></b>}
                                </span>
                            }>
                                {!student.roles.includes("headman") &&
                                    <ImageButton
                                        className="button-table-action"
                                        src="../../static/images/headman.png"
                                        onClick={() => {
                                            show("assign-headman-dialog", {
                                                student,
                                                headman
                                            });
                                        }}/>
                                }
                                <ImageButton
                                    className="button-table-action"
                                    src="../../static/images/delete.png"
                                    onClick={() => {
                                        show("delete-student-dialog", student);
                                    }}/>
                            </TableActionCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <Form className="admin-modals">
                <DialogWindow
                    confirmType="submit"
                    name="delete-student-dialog"
                    title="Удалить студента?"
                    warningText={(student) => `Вы удаляете студента ${student?.surname} ${student?.name} ${student?.middlename ? student.middlename : ""}`}
                    positiveButtonClick={async (student) => {
                        await GroupsService.deleteStudent(group._id, student._id);
                    }}/>
                <DialogWindow
                    confirmType="submit"
                    name="assign-headman-dialog"
                    title="Назначить старосту?"
                    warningText={(data) => `Вы назначаете студента ${data?.student.surname} ${data?.student.name}${data?.student.middlename ? data?.student.middlename : ""} старостой`}
                    positiveButtonClick={async (data) => {
                        await (() => {
                            RolesService.addRoleToUser(data?.student._id, "headman");
                            if (data?.headman) {
                                RolesService.removeRoleFromUser(data?.headman._id, "headman");
                            }
                        })();
                    }}/>
            </Form>
        </div>
    );
};

const AddStudent = ({group}) => {
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [middlename, setMiddleName] = useState("");

    const firstInput = useRef(null);

    return (
        <Form
            method="post"
            className="group-page__new-student-form"
            onSubmit={() => {
                setName("");
                setSurname("");
                setMiddleName("");
                firstInput.current.focus();
            }}>
            <input type="hidden" name="group" value={group._id}/>
            <TextInput
                ref={firstInput}
                icon="../../static/images/user-initials.png"
                placeholder="Фамилия"
                name="student_surname"
                value={surname}
                onChange={(value) => {
                    setSurname(value);
                }}
            />
            <TextInput
                icon="../../static/images/user-initials.png"
                placeholder="Имя"
                name="student_name"
                value={name}
                onChange={(value) => {
                    setName(value);
                }}
            />
            <TextInput
                icon="../../static/images/user-initials.png"
                placeholder="Отчество"
                name="student_middlename"
                value={middlename}
                onChange={(value) => {
                    setMiddleName(value);
                }}
            />
            <Button
                disabled={!(name && surname)}
                name="intent"
                value="add"
                type="submit"
                className="button-add-student">
                Добавить
            </Button>
        </Form>
    )
}

export default Group;