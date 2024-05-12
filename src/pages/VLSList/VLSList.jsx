import React from 'react';
import {Form, useLoaderData} from "react-router-dom";
import VLSService from "../../services/VLSService";
import AdminManager from "../../utils/AdminManager";

export async function loader() {
    return await VLSService.getVLSs();
}

const VLSList = () => {
    const vlss = useLoaderData();

    return (
        <div>
            <h1>Виртуальные учебные пространства</h1>
            <table>
                <thead>
                <tr>
                    <th>Группа</th>
                    <th>Действия</th>
                </tr>
                </thead>
                <tbody>
                {vlss.map(vls =>
                    <tr key={vls._id}>
                        <td>{vls.group.name}</td>
                        <td>
                            <button onClick={async () => {
                                await AdminManager.generateLoginAndPasswordForMany(vls.group.students, `Логины и пароли для студентов группы ${vls.group.name}.txt`);
                            }}>Сгенерировать пароли для студентов
                            </button>
                            <Form action={vls._id}>
                                <button>Открыть</button>
                            </Form>
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

export default VLSList;