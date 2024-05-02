import React, {useState} from 'react';
import {Form, Link, useLoaderData} from "react-router-dom";
import VLSService from "../../services/VLSService";
import CurriculumService from "../../services/CurriculumService";

export async function loader({params}) {
    const vlsId = params.id;

    const vls = await VLSService.getVLS(vlsId);
    const curriculumCheck = await CurriculumService.checkCurriculum(vls.group._id);
    const curriculum = await CurriculumService.getCurriculum(vls.group._id);

    return [vls, curriculumCheck, curriculum];
}

export async function action({request}){
    const formData = await request.formData();
    const disciplines = formData.getAll("disciplines");
    const teachers = formData.getAll("teachers");
    const vlsId = formData.get("vlsId");

    const added = await VLSService.addStudyChats(vlsId, disciplines, teachers);

    return added;
}

const VirtualLearningSpace = () => {
    const [vls, curriculumCheck, curriculum] = useLoaderData();

    const dateNow = new Date();
    const startDate = new Date(Number(curriculum.academicStartYear), 8 - 3, 0, 0, 0, 1);
    const difference = dateNow - startDate;
    const semestersNumber = difference / 1000 / 60 / 60 / 24 / 30 / 12;
    const currentSemester = Math.round(semestersNumber.toFixed(2) * 2);

    const [isCreatingStudyChat, setIsCreatingStudyChat] = useState(false);
    const [currentSemesterNumber, setCurrentSemesterNumber] = useState(currentSemester);
    const [currentSemesterData, setCurrentSemesterData] = useState(getCurrentSemesterData(curriculum, currentSemester));

    return (
        <div>
            <h1>Виртуальное учебное пространство группы {vls.group.name}</h1>
            <h2>Информация</h2>
            {curriculumCheck.exists ?
                <Link to={`../curriculums/${vls.group._id}`}>Учебный план группы {vls.group.name}</Link>
                :
                <p>Учебный план группы {vls.group.name} отсутствует! <Link to="../curriculums">Создать</Link></p>
            }
            <h2>Чаты</h2>
            <table>
                <thead>
                <tr>
                    <th>Наименование</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>{vls.mainChat.name} <b><i>(Основной)</i></b></td>
                </tr>
                </tbody>
            </table>
            <h2>Учебные чаты</h2>
            {vls.currentSemesterChats.length === 0 ? !isCreatingStudyChat &&
                <p>
                    <i>Пусто </i>
                    <button onClick={() => setIsCreatingStudyChat(true)}>
                        Создать чаты на основе учебного плана для текущего семестра
                    </button>
                </p> :
                <table>
                    <thead>
                    <tr>
                        <th>Наименование</th>
                        <th>Преподаватель</th>
                    </tr>
                    </thead>
                    <tbody>
                    {vls.currentSemesterChats.map(chat =>
                        <tr key={chat._id}>
                            <td>{chat.name}</td>
                            <td>{chat.teacher.surname} {chat.teacher.name} {chat.teacher.middlename}</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            }
            {isCreatingStudyChat &&
                <Form method="post" onSubmit={() => {
                    setIsCreatingStudyChat(false);
                }}>
                    <h2>Добавление учебных чатов</h2>
                    <p>Текущий семестр: {currentSemester}</p>
                    <label>Семестр:&nbsp;
                        <input
                            name="currentSemesterNumber"
                            value={currentSemesterNumber}
                            type="number"
                            min={1}
                            max={Number(curriculum.semestersNumber)}
                            onChange={(e) => {
                                setCurrentSemesterNumber(Number(e.target.value));
                                setCurrentSemesterData(getCurrentSemesterData(curriculum, Number(e.target.value)));
                            }}/>
                    </label>
                    <input type="hidden" name="vlsId" value={vls._id}/>
                    <table>
                        <thead>
                        <tr>
                            <th>Учебная дисциплина</th>
                            <th>Преподаватель</th>
                        </tr>
                        </thead>
                        <tbody>
                        {currentSemesterData.map(data =>
                            <tr key={data.discipline._id + data.teacher._id}>
                                <td>
                                    {data.discipline.name}
                                    <input type="hidden" name="disciplines" value={data.discipline.name}/>
                                </td>
                                <td>
                                    {data.teacher.surname} {data.teacher.name} {data.teacher.middlename}
                                    <input type="hidden" name="teachers" value={data.teacher._id}/>
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                    <input
                        type="button"
                        value="Отмена"
                        onClick={() => setIsCreatingStudyChat(false)}/>
                    <input type="submit" value="Готово"/>
                </Form>
            }
        </div>
    );
};

function getCurrentSemesterData(curriculum, semester) {
    let start = 0;
    let end = 0;
    let foundSemester = false;

    for (let i = 0; i < curriculum.counts.length; i++) {
        if (i + 1 === semester) {
            foundSemester = true;
        }

        if (!foundSemester) {
            start += curriculum.counts[i];
        } else {
            end += curriculum.counts[i];
            break;
        }
    }

    return curriculum.data.slice(start, start + end);
}

export default VirtualLearningSpace;