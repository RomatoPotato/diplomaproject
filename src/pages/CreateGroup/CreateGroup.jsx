import React, {useState} from 'react';
import {Form, redirect, useLoaderData} from "react-router-dom";
import EIService from "../../services/EIService";

let nextId = 0;

export async function action({request}) {
    const formData = await request.formData();

    await EIService.addGroup(formData.get("year"), formData.get("specialty"), formData.get("groupName"), formData.getAll("students"));

    return redirect("../groups");
}

const CreateGroup = () => {
    const specialties = useLoaderData();

    const [students, setStudents] = useState(new Map());

    return (
        <div>
            <h1>Добавление группы</h1>
            <Form method="post">
                <label>
                    Курс:&nbsp;
                    <select name="year">
                        {[1, 2, 3, 4, 5, 6].map(i =>
                            <option key={i}>{i}</option>
                        )}
                    </select>
                </label>
                <br/>
                <label>
                    Направление:&nbsp;
                    <select name="specialty">
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
                <AddStudent onAddStudent={(initials) => {
                    setStudents((prevState) => new Map(prevState.set(nextId++, initials)));
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
                <input type="submit" value="Готово"/>
            </Form>
        </div>
    )
        ;
};

const AddStudent = ({onAddStudent}) => {
    const [initials, setInitials] = useState("");

    return (
        <>
            <input
                placeholder="Имя и фамилия студента"
                value={initials}
                onChange={(e) => {
                    setInitials(e.target.value);
                }}
            />
            <button onClick={(e) => {
                e.preventDefault(); // prevent from submitting form
                if (initials?.length !== 0) {
                    setInitials("");
                    onAddStudent(initials);
                }
            }}>Добавить
            </button>
        </>
    )
}

const StudentsList = ({students, onStudentChange, onStudentRemove}) => {
    return (
        <ul>
            {Array.from(students.entries()).map(([id, initials]) =>
                <li key={id}>
                    <input
                        name="students"
                        value={initials}
                        onChange={(e) => {
                            onStudentChange(id, e.target.value);
                        }}/>
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