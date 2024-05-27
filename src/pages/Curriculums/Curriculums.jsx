import React, {Fragment, useState} from 'react';
import "./Curriculums.css";
import {Form, useLoaderData} from "react-router-dom";
import GroupsService from "../../services/GroupsService";
import TeachersService from "../../services/TeachersService";
import CurriculumService from "../../services/CurriculumService";
import Table, {TableBody, TableCell, TableHead, TableRow} from "../../components/ui/Table/Table";
import ImageButton from "../../components/ui/ImageButton/ImageButton";
import {show} from "../../utils/GlobalEventListeners/ShowModalsEventListener";
import DialogWindow from "../../components/ui/DialogWindow/DialogWindow";
import BetterSelect from "../../components/ui/BetterSelect/BetterSelect";
import NumberInput from "../../components/ui/NumberInput/NumberInput";
import Button from "../../components/ui/Button/Button";

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

    if (!group){
        return null;
    }

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

    if (allDisciplines.length === 0){
        return null;
    }

    return await CurriculumService.addCurriculum(group, startYear, semestersNumber, allDisciplines, allTeachers, counts);
}

const Curriculums = () => {
    const [groups, teachers, curriculums] = useLoaderData();

    const academicStartYear = getCurrentAcademicYear();

    const [startYear, setStartYear] = useState(academicStartYear);
    const [studyDuration, setStudyDuration] = useState(4);

    return (
        <div className="curriculums-page">
            <h1>Учебные планы</h1>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Группа</TableCell>
                        <TableCell>Учебные гойда</TableCell>
                        <TableCell>Действия</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {curriculums.map(curriculum =>
                        <TableRow key={curriculum.group._id}>
                            <TableCell>{curriculum.group.name}</TableCell>
                            <TableCell>{curriculum.academicStartYear}-{curriculum.academicStartYear + curriculum.semestersNumber / 2}гг.</TableCell>
                            <TableCell>
                                <ImageButton
                                    className="button-table-action"
                                    src="../static/images/delete.png"
                                    onClick={() => {
                                        show("delete-curriculum-dialog", curriculum);
                                    }}/>
                                <Form action={curriculum.group._id}>
                                    <ImageButton
                                        type="submit"
                                        src="../static/images/open.png"
                                        className="button-table-action"/>
                                </Form>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <h2>Создать</h2>
            <Form method="post">
                <div className="form-layout">
                    <span>Группа:&nbsp;</span>
                    <BetterSelect
                        defaultElement={{text: "Не выбрана", value: null}}
                        name="group"
                        elements={groups.map(group => ({
                            text: group.name,
                            value: group._id
                        }))}/>
                    <span>Учебных курсов:&nbsp;</span>
                    <NumberInput
                        min={1}
                        name="studyDuration"
                        value={studyDuration}
                        onChange={(value) => {
                            setStudyDuration(value);

                            let temp = [];
                            for (let i = 1; i <= value; i++) {
                                temp.push(i);
                            }
                        }}/>
                    <span>Год начала обучения:&nbsp;</span>
                    <div style={{display: "flex", gap: "5px"}}>
                        <NumberInput
                            min={1}
                            name="startYear"
                            value={startYear}
                            onChange={(value) => {
                                setStartYear(value);
                            }}/>
                        <Button onClick={() => setStartYear(academicStartYear)}>Текущий</Button>
                        <Button onClick={() => setStartYear(academicStartYear + 1)}>Следующий</Button>
                    </div>
                    <p>Год окончания обучения:</p>
                    <p>{Number(startYear) + Number(studyDuration)}</p>
                </div>
                <input type="hidden" name="semestersNumber" value={studyDuration * 2}/>
                {[...Array(studyDuration * 2)].map((s, i) =>
                    <Fragment key={i}>
                        <p><b>{i + 1} семестр</b></p>
                        <SemesterInputTable teachers={teachers} semester={i + 1}/>
                    </Fragment>
                )}
                <Button className="curriculums-page__button-save" type="submit">Сохранить</Button>
            </Form>
            <Form className="admin-modals">
                <DialogWindow
                    confirmType="submit"
                    name="delete-curriculum-dialog"
                    title="Удалить учебный план?"
                    warningText={(curriculum) => "Будет удален учебный план группы " + curriculum?.group.name}
                    positiveButtonClick={async (curriculum) => {
                        await CurriculumService.deleteCurriculum(curriculum._id);
                    }}/>
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
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Учебная дисциплина</TableCell>
                    <TableCell>Преподаватель</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {semesterData.map(data =>
                    <TableRow key={data.discipline.id + data.teacher.id}>
                        <TableCell>
                            {data.discipline.name}
                            <input type="hidden" value={data.discipline.id} name={"disciplines" + semester}/>
                        </TableCell>
                        <TableCell>
                            {data.teacher.name}
                            <input type="hidden" value={data.teacher.id} name={"teachers" + semester}/>
                        </TableCell>
                    </TableRow>
                )}
                {isAdding &&
                    <>
                        <TableRow>
                            <TableCell>
                                <span>Выберите дисциплину:&nbsp;</span>
                                <BetterSelect
                                    defaultElement={{text: "Не выбрана", value: null}}
                                    onChange={(value) => {
                                        setSelectedDiscipline(value);
                                        setSelectedTeacher(disciplinesTeachersMap.get(value)[0]);
                                    }}
                                    elements={Array.from(disciplinesTeachersMap.entries()).map(([disciplineId]) => ({
                                        text: disciplinesIdsMap.get(disciplineId),
                                        value: disciplineId
                                    }))}/>
                            </TableCell>
                            <TableCell>
                                <span>Выберите преподавателя:&nbsp;</span>
                                <BetterSelect
                                    defaultElement={{text: "Не выбран", value: null}}
                                    onChange={(value) => {
                                        setSelectedTeacher(value);
                                    }}
                                    elements={selectedDiscipline ? disciplinesTeachersMap.get(selectedDiscipline).map(teacherId => ({
                                        text: teachersIdsMap.get(teacherId),
                                        value: teacherId
                                    })) : []}/>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2} style={{justifyContent: "center", gap: "5px"}}>
                                <Button
                                    onClick={() => {
                                        setIsAdding(false);
                                        setSelectedDiscipline(null);
                                        setSelectedTeacher(null);
                                    }}>
                                    Отмена
                                </Button>
                                <Button
                                    disabled={!selectedTeacher}
                                    onClick={() => {
                                        setSemesterData([
                                            ...semesterData,
                                            {
                                                discipline: {
                                                    id: selectedDiscipline,
                                                    name: disciplinesIdsMap.get(selectedDiscipline)
                                                },
                                                teacher: {
                                                    id: selectedTeacher,
                                                    name: teachersIdsMap.get(selectedTeacher)
                                                }
                                            }
                                        ])
                                        setIsAdding(false);
                                    }}>
                                    Готово
                                </Button>
                            </TableCell>
                        </TableRow>
                    </>
                }
                {!isAdding &&
                    <TableRow>
                        <TableCell style={{justifyContent: "center"}} colSpan={2}>
                            <Button
                                onClick={() => {
                                    setIsAdding(true);
                                }}>
                                ➕➕➕➕➕
                            </Button>
                        </TableCell>
                    </TableRow>
                }
            </TableBody>
        </Table>
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