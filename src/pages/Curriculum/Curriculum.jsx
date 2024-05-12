import React, {Fragment} from 'react';
import CurriculumService from "../../services/CurriculumService";
import {useLoaderData} from "react-router-dom";

export async function loader({params}) {
    const groupId = params.id;
    return await CurriculumService.getCurriculum(groupId);
}

const Curriculum = () => {
    const curriculum = useLoaderData();

    const years = [];

    for (let i = 0; i < curriculum.data.length;) {
        for (let j = 0; j < curriculum.counts.length; j++) {
            if (j % 2 === 0) {
                years.push({
                    number: j / 2 + 1,
                    semesters: []
                });
            }

            years[Math.floor(j / 2)].semesters.push({
                number: j + 1,
                data: []
            });

            for (let k = 0; k < curriculum.counts[j]; k++) {
                years[Math.floor(j / 2)].semesters[j % 2].data.push(curriculum.data[i]);
                i++;
            }
        }
    }

    return (
        <div>
            <h1>Учебный план группы {curriculum._id.name}</h1>
            <p>Учебные года:&nbsp;
                <b>{curriculum.academicStartYear}-{curriculum.academicStartYear + curriculum.semestersNumber / 2}</b>
            </p>
            <p><b>{curriculum.semestersNumber}</b> семестров</p>
            {years.map(year =>
                <Fragment key={year.number}>
                    <h2>{year.number} год ({`${curriculum.academicStartYear + (year.number - 1)}-${curriculum.academicStartYear + year.number}гг.`})</h2>
                    {year.semesters.map(semester =>
                        <Fragment key={semester.number}>
                            <h3>Семестр {semester.number}</h3>
                            <table>
                                <thead>
                                <tr>
                                    <th>Учебная дисциплина</th>
                                    <th>Преподаватель</th>
                                </tr>
                                </thead>
                                <tbody>
                                {semester.data.map(data =>
                                    <tr key={data.teacher._id + data.discipline._id}>
                                        <td>{data.discipline.name}</td>
                                        <td>{data.teacher.surname} {data.teacher.name} {data.teacher.middlename}</td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </Fragment>
                    )}
                </Fragment>
            )}
        </div>
    );
};

export default Curriculum;