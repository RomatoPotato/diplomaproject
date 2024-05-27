import React, {useRef, useState} from 'react';
import "./CreateGroup.css";
import {Form, redirect, useLoaderData} from "react-router-dom";
import TeachersService from "../../services/TeachersService";
import SpecialtiesService from "../../services/SpecialtiesService";
import GroupsService from "../../services/GroupsService";
import NumberInput from "../../components/ui/NumberInput/NumberInput";
import BetterSelect from "../../components/ui/BetterSelect/BetterSelect";
import TextInput from "../../components/ui/TextInput/TextInput";
import ImageButton from "../../components/ui/ImageButton/ImageButton";
import Button from "../../components/ui/Button/Button";
import Table, {TableActionCell, TableBody, TableCell, TableHead, TableRow} from "../../components/ui/Table/Table";

let nextId = 0;

export async function loader() {
    const specialties = await SpecialtiesService.getSpecialties();
    const teachers = await TeachersService.getTeachers();

    return [specialties, teachers];
}

export async function action({request}) {
    const formData = await request.formData();

    const studentsArray = formData.getAll("students");
    const studentsIdsArray = formData.getAll("students_ids");

    const students = [];

    for (let i = 0; i < studentsArray.length; i++){
        students.push({
            initials: studentsArray[i],
            id: studentsIdsArray[i]
        });
    }

    await GroupsService.addGroup(
        formData.get("year"),
        formData.get("specialty"),
        formData.get("groupName"),
        students,
        formData.get("headman"),
        formData.get("curator"));

    return redirect("../groups");
}

const CreateGroup = () => {
    const [specialties, teachers] = useLoaderData();

    const [students, setStudents] = useState(new Map());
    const [isYearSelected, setIsYearSelected] = useState(false);
    const [isSpecialtySelected, setIsSpecialtySelected] = useState(false);
    const [hasName, setHasName] = useState(false);
    const [isHeadmanSelected, setIsHeadmanSelected] = useState(false);
    const [isCuratorSelected, setIsCuratorSelected] = useState(false);

    return (
        <div className="create-group-page">
            <h1>Добавление группы</h1>
            <Form method="post">
                <div className="form-layout">
                    <span>Курс:&nbsp;</span>
                    <NumberInput
                        onChange={(value) => {
                            setIsYearSelected(value !== "" && value);
                        }}
                        name="year"
                        min={1}/>
                    <span>Специальность:&nbsp;</span>
                    <BetterSelect
                        name="specialty"
                        defaultElement={{text: "Не выбрано", value: null}}
                        elements={specialties.map(specialty => ({
                            text: specialty.name,
                            value: specialty._id
                        }))}
                        onChange={(value) => {
                            setIsSpecialtySelected(value !== "" && value);
                        }}
                    />
                    <span>Наименование: </span>
                    <TextInput
                        onChange={(value) => {
                            setHasName(value !== "" && value);
                        }}
                        icon="../static/images/title.png"
                        name="groupName"/>
                </div>
                <AddStudent onAddStudent={(name, surname, middlename) => {
                    setStudents((prevState) => new Map(prevState.set(nextId++, {
                        name,
                        surname,
                        middlename
                    })));
                }}/>
                <p>Список студентов:</p>
                {students.size === 0 ?
                    <p><i>Пусто</i></p> :
                    <StudentsList
                        students={students}
                        onStudentRemove={(id) => {
                            setStudents((prevState) => {
                                const tempMap = new Map(prevState);
                                tempMap.delete(id);
                                return tempMap;
                            });
                        }}/>
                }
                <div className="form-layout">
                    <span>Староста:&nbsp;</span>
                    <BetterSelect
                        name="headman"
                        onChange={(value) => {
                            setIsHeadmanSelected(value !== "" && value !== null);
                        }}
                        defaultElement={{text: "Не выбран", value: null}}
                        elements={Array.from(students.entries()).map(([id, student]) => ({
                            text: `${student.surname} ${student.name} ${student.middlename}`,
                            value: id
                        }))}/>
                    <span>Куратор:&nbsp;</span>
                    <BetterSelect
                        name="curator"
                        onChange={(value) => {
                            setIsCuratorSelected(value !== "" && value);
                        }}
                        defaultElement={{text: "Не выбран", value: null}}
                        elements={teachers.map(teacher => ({
                            text: `${teacher.surname} ${teacher.name} ${teacher.middlename}`,
                            value: teacher._id
                        }))}/>
                </div>
                <Button
                    disabled={!(isSpecialtySelected && hasName && students.size > 0
                        && isHeadmanSelected && isCuratorSelected && isYearSelected)}
                    className="button-add-group"
                    type="submit">
                    Готово
                </Button>
            </Form>
        </div>
    );
};

const AddStudent = ({onAddStudent}) => {
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [middlename, setMiddleName] = useState("");

    const firstInput = useRef(null);

    return (
        <div className="add-student-layout">
            <TextInput
                icon="../static/images/user-initials.png"
                ref={firstInput}
                placeholder="Фамилия"
                value={surname}
                onChange={(value) => {
                    setSurname(value);
                }}
            />
            <TextInput
                icon="../static/images/user-initials.png"
                placeholder="Имя"
                value={name}
                onChange={(value) => {
                    setName(value);
                }}
            />
            <TextInput
                icon="../static/images/user-initials.png"
                placeholder="Отчество"
                value={middlename}
                onChange={(value) => {
                    setMiddleName(value);
                }}
            />
            <Button
                type="submit"
                className="button-add-student"
                onClick={(e) => {
                    e.preventDefault();
                    if (name?.length !== 0 && surname?.length !== 0) {
                        setName("");
                        setSurname("");
                        setMiddleName("");
                        firstInput.current.focus();
                        onAddStudent(name, surname, middlename);
                    }
                }}>
                Добавить
            </Button>
        </div>
    )
}

const StudentsList = ({students, onStudentRemove}) => {
    return (
        <Table className="students-table">
            <TableHead>
                <TableRow>
                    <TableCell>ФИО</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {Array.from(students.entries()).map(([id, student]) =>
                    <TableRow>
                        <TableActionCell text={`${student.surname} ${student.name} ${student.middlename}`}>
                            <input type="hidden" name="students"
                                   value={`${student.surname} ${student.name} ${student.middlename}`}/>
                            <input type="hidden" name="students_ids"
                                   value={student.id}/>
                            <ImageButton
                                className="button-remove-student"
                                src="../static/images/delete.png"
                                onClick={() => {
                                    onStudentRemove(id);
                                }}/>
                        </TableActionCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    )
}

export default CreateGroup;