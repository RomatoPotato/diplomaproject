import React, {useRef, useState} from 'react';
import {Form, redirect, useLoaderData} from "react-router-dom";
import TeachersService from "../../services/TeachersService";
import SpecialtiesService from "../../services/SpecialtiesService";
import GroupsService from "../../services/GroupsService";

let nextId = 0;

export async function loader(){
    const specialties = await SpecialtiesService.getSpecialties();
    const teachers = await TeachersService.getTeachers();

    return [specialties, teachers];
}

export async function action({request}) {
    const formData = await request.formData();

    console.log(formData.getAll("students"));

    await GroupsService.addGroup(
        formData.get("year"),
        formData.get("specialty"),
        formData.get("groupName"),
        formData.getAll("students"),
        formData.get("headman"),
        formData.get("curator"));

    return redirect("../groups");
}

const CreateGroup = () => {
    const [specialties, teachers] = useLoaderData();

    const [students, setStudents] = useState(new Map());

    return (
        <div>
            <h1>Добавление группы</h1>
            <Form method="post">
                <label>
                    Курс:&nbsp;
                    <input name="year" type="number" defaultValue={1} min={1} />
                </label>
                <br/>
                <label>
                    Специальность:&nbsp;
                    <select name="specialty" defaultValue="">
                        <option disabled></option>
                        {specialties.map(specialty =>
                            <option value={specialty._id} key={specialty._id}>{specialty.name}</option>
                        )}
                    </select>
                </label>
                <br/>
                <label>
                    Наименование: <input name="groupName"/>
                </label>
                <br/>
                <AddStudent onAddStudent={(name, surname, middlename) => {
                    setStudents((prevState) => new Map(prevState.set(nextId++, {
                        name,
                        surname,
                        middlename
                    })));
                }}/>
                <StudentsList
                    students={students}
                    onStudentChange={(id, value) => {
                        setStudents((prevState) => {
                            const tempMap = new Map(prevState);
                            tempMap.set(id, value);
                            return tempMap;
                        });
                    }}
                    onStudentRemove={(id) => {
                        setStudents((prevState) => {
                            const tempMap = new Map(prevState);
                            tempMap.delete(id);
                            return tempMap;
                        });
                    }}/>
                <label>Староста:&nbsp;
                    <select name="headman" defaultValue="" disabled={students.size === 0}>
                        <option disabled></option>
                        {Array.from(students.entries()).map(([id, student]) =>
                            <option key={id}>{student.surname} {student.name} {student.middlename}</option>
                        )}
                    </select>
                </label>
                <br/>
                <label>Куратор:&nbsp;
                    <select name="curator" defaultValue="">
                        <option disabled></option>
                        {teachers.map(teacher =>
                            <option key={teacher._id} value={teacher._id}>{teacher.surname} {teacher.name} {teacher.middlename}</option>
                        )}
                    </select>
                </label>
                <br/>
                <input type="submit" value="Готово"/>
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
        <>
            <input
                ref={firstInput}
                placeholder="Фамилия"
                value={surname}
                onChange={(e) => {
                    setSurname(e.target.value);
                }}
            />
            <input
                placeholder="Имя"
                value={name}
                onChange={(e) => {
                    setName(e.target.value);
                }}
            />
            <input
                placeholder="Отчество"
                value={middlename}
                onChange={(e) => {
                    setMiddleName(e.target.value);
                }}
            />
            <button onClick={(e) => {
                e.preventDefault();
                if (name?.length !== 0 && surname?.length !== 0) {
                    setName("");
                    setSurname("");
                    setMiddleName("");
                    firstInput.current.focus();
                    onAddStudent(name, surname, middlename);
                }
            }}>Добавить</button>
        </>
    )
}

const StudentsList = ({students, onStudentChange, onStudentRemove}) => {
    return (
        <ul>
            {Array.from(students.entries()).map(([id, student]) =>
                <li key={id}>
                    <input
                        value={student.surname}
                        onChange={(e) => {
                            onStudentChange(id, {
                                ...student,
                                surname: e.target.value
                            });
                        }}/>
                    <input
                        value={student.name}
                        onChange={(e) => {
                            onStudentChange(id, {
                                ...student,
                                name: e.target.value
                            });
                        }}/>
                    <input
                        value={student.middlename}
                        onChange={(e) => {
                            onStudentChange(id, {
                                ...student,
                                middlename: e.target.value
                            });
                        }}/>
                    <input type="hidden" name="students" value={`${student.surname} ${student.name} ${student.middlename}`}/>
                    <button onClick={() => {
                        onStudentRemove(id);
                    }}>✖️
                    </button>
                </li>
            )}
        </ul>
    )
}

export default CreateGroup;