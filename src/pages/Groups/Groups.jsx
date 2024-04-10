import React from 'react';
import {useLoaderData} from "react-router-dom";
import EIService from "../../services/EIService";

export async function loader() {
    const groups = await EIService.getGroups();
    groups.sort((s1, s2) => s1.year - s2.year);
    return groups;
}

const Groups = () => {
    const groups = useLoaderData();

    return (
        <div className="specialties">
            <h1>Группы</h1>
            <table>
                <thead>
                <tr>
                    <th>Курс</th>
                    <th>Наименование</th>
                    <th>Специальность</th>
                    <th>Студенты</th>
                </tr>
                </thead>
                <tbody>
                {groups.map(group =>
                    <tr key={group._id}>
                        <td>{group.year}</td>
                        <td>{group.name}</td>
                        <td>{group.specialty.name}</td>
                        <td>
                            {group.students.map(student =>
                                <p key={student._id}>{student.name} {student.surname}</p>
                            )}
                        </td>
                    </tr>
                )}
                </tbody>
                <tfoot>

                </tfoot>
            </table>
        </div>
    );
};

export default Groups;