import React, {Fragment, useState} from 'react';
import {Form, useLoaderData} from "react-router-dom";
import GroupsService from "../../services/GroupsService";
import TeachersService from "../../services/TeachersService";
import CurriculumService from "../../services/CurriculumService";

export async function loader() {
    const groups = await GroupsService.getGroups();
    const teachers = await TeachersService.getTeachers();
    const curriculums = await CurriculumService.getAllCurriculums();

    return [groups, teachers, curriculums];
}

export async function action({request}) {
    const formData = await request.formData();

    const group = formData.get("group");
    const semestersNumber = formData.get("semestersNumber");
    const startYear = formData.get("startYear");

    let allDisciplines = [];
    let allTeachers = [];
    const counts = [];

    for (let i = 1; i <= semestersNumber; i++) {
        const disciplines = formData.getAll("disciplines" + i);
        const teachers = formData.getAll("teachers" + i);

        allDisciplines = allDisciplines.concat(disciplines);
        allTeachers = allTeachers.concat(teachers);
        counts.push(disciplines.length);
    }

    const added = await CurriculumService.addCurriculum(group, startYear, semestersNumber, allDisciplines, allTeachers, counts);

    return added;
}

const Curriculums = () => {
    const [groups, teachers, curriculums] = useLoaderData();

    const academicStartYear = getCurrentAcademicYear();

    const [startYear, setStartYear] = useState(academicStartYear);
    const [studyDuration, setStudyDuration] = useState(4);

    return (
        <div>
            <h1>Учебные планы</h1>
            <div style={{display: "flex", gap: "5px"}}>
                {curriculums.map(curriculum =>
                    <div key={curriculum._id._id} style={{border: "2px solid black"}}>
                        <p>{curriculum._id.name}</p>
                        <p>{curriculum.academicStartYear}-{curriculum.academicStartYear + curriculum.semestersNumber / 2}гг.</p>
                        <Form action={`${curriculum._id._id}`}>
                            <button type="submit">Открыть</button>
                        </Form>
                    </div>
                )}
            </div>
            <h2>Создать</h2>
            <Form method="post">
                <label>Группа:&nbsp;
                    <select defaultValue="" name="group">
                        <option disabled></option>
                        {groups.map(group =>
                            <option key={group._id} value={group._id}>{group.name}</option>
                        )}
                    </select>
                </label>
                <br/>
                <label>Продолжительность обучения:
                    <input
                        type="number"
                        min="1"
                        name="studyDuration"
                        value={studyDuration}
                        onChange={(e) => {
                            setStudyDuration(e.target.value);

                            let temp = [];
                            for (let i = 1; i <= Number(e.target.value); i++){
                                temp.push(i);
                            }
                        }}/>
                    курсов
                </label>
                <br/>
                <label>Год начала обучения:&nbsp;
                    <input
                        type="number"
                        name="startYear"
                        value={startYear}
                        onChange={(e) => {
                            setStartYear(e.target.value);
                        }}/>
                    <input type="button" value="Текущий" onClick={() => {
                        setStartYear(academicStartYear);
                    }}/>
                    <input type="button" value="Следующий" onClick={() => {
                        setStartYear(academicStartYear + 1);
                    }}/>
                </label>
                <p>Год окончания обучения: {Number(startYear) + Number(studyDuration)}</p>
                <input type="hidden" name="semestersNumber" value={studyDuration * 2}/>
                {[...Array(studyDuration * 2)].map((s, i) =>
                    <Fragment key={i}>
                        <p><b>{i + 1} семестр</b></p>
                        <SemesterInputTable teachers={teachers} semester={i + 1}/>
                    </Fragment>
                )}
                <br/>
                <input type="submit" value="Сохранить"/>
            </Form>
        </div>
    );
};

function SemesterInputTable({teachers, semester}) {
    const [isAdding, setIsAdding] = useState(false);
    const [selectedDiscipline, setSelectedDiscipline] = useState(null);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [semesterData, setSemesterData] = useState([]);

    let disciplinesTeachersMap = new Map();
    let disciplinesIdsMap = new Map();
    let teachersIdsMap = new Map();

    for (const teacher of teachers) {
        const fullName = `${teacher.surname} ${teacher.name} ${teacher.middlename}`;

        for (const discipline of teacher.disciplines) {
            disciplinesTeachersMap.set(discipline._id, [...disciplinesTeachersMap.get(discipline._id) || [], teacher._id]);
            disciplinesIdsMap.set(discipline._id, discipline.name);
        }

        teachersIdsMap.set(teacher._id, fullName);
    }

    return (
        <table>
            <thead>
            <tr>
                <th>Учебная дисциплина</th>
                <th>Преподаватель</th>
            </tr>
            </thead>
            <tbody>
            {semesterData.map(data =>
                <tr key={data.discipline.id + data.teacher.id}>
                    <td>
                        {data.discipline.name}
                        <input type="hidden" value={data.discipline.id} name={"disciplines" + semester}/>
                    </td>
                    <td>
                        {data.teacher.name}
                        <input type="hidden" value={data.teacher.id} name={"teachers" + semester}/>
                    </td>
                </tr>
            )}
            {isAdding &&
                <>
                    <tr>
                        <td>
                            <label>Выберите дисциплину:&nbsp;
                                <select
                                    defaultValue=""
                                    onChange={(e) => {
                                        setSelectedDiscipline(e.target.value);
                                        setSelectedTeacher(disciplinesTeachersMap.get(e.target.value)[0]);
                                    }}>
                                    <option disabled></option>
                                    {Array.from(disciplinesTeachersMap.entries()).map(([disciplineId]) =>
                                        <option key={disciplineId}
                                                value={disciplineId}>{disciplinesIdsMap.get(disciplineId)}</option>
                                    )}
                                </select>
                            </label>
                        </td>
                        <td>
                            <label>Выберите преподавателя:&nbsp;
                                <select
                                    disabled={!selectedDiscipline}
                                    onChange={(e) => {
                                        setSelectedTeacher(e.target.value);
                                    }}>
                                    {selectedDiscipline && disciplinesTeachersMap.get(selectedDiscipline).map(teacherId =>
                                        <option key={teacherId}
                                                value={teacherId}>{teachersIdsMap.get(teacherId)}</option>
                                    )}
                                </select>
                            </label>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2} style={{textAlign: "center"}}>
                            <input
                                type="button"
                                value="Отмена"
                                onClick={() => {
                                    setIsAdding(false);
                                    setSelectedDiscipline(null);
                                    setSelectedTeacher(null);
                                }}/>
                            <input
                                type="button"
                                value="Готово"
                                onClick={() => {
                                    setSemesterData([
                                        ...semesterData,
                                        {
                                            discipline: {
                                                id: selectedDiscipline,
                                                name: disciplinesIdsMap.get(selectedDiscipline)
                                            },
                                            teacher: {id: selectedTeacher, name: teachersIdsMap.get(selectedTeacher)}
                                        }
                                    ])
                                    setIsAdding(false);
                                }}/>
                        </td>
                    </tr>
                </>
            }
            {!isAdding &&
                <tr style={{textAlign: "center"}}>
                    <td colSpan={2}>
                        <input
                            type="button"
                            value="➕➕➕➕➕"
                            onClick={() => {
                                setIsAdding(true);
                            }}/>
                    </td>
                </tr>
            }
            </tbody>
        </table>
    );
}

function getCurrentAcademicYear() {
    let academicStartYear;

    const currentDate = new Date();

    if (currentDate.getMonth() >= 0 && currentDate.getMonth() < 9) {
        academicStartYear = currentDate.getFullYear() - 1;
    } else {
        academicStartYear = currentDate.getFullYear();
    }

    return academicStartYear;
}

export default Curriculums;