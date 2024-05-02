import React from 'react';
import {useLoaderData} from "react-router-dom";
import GroupsService from "../../services/GroupsService";

export async function loader() {
    const groups = await GroupsService.getGroups();
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
                    <th>Куратор</th>
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
                                <p key={student._id}>
                                    {student.name} {student.surname}{student.middlename && ` ${student.middlename}`}
                                    {student.roles.map(role => role === "headman" &&
                                        <b><i> (Староста)</i></b>
                                    )}
                                </p>
                            )}
                        </td>
                        <td>{group.curator.surname} {group.curator.name} {group.curator.middlename}</td>
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