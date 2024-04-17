import React from 'react';
import EIService from "../../services/EIService";
import {Form, useLoaderData} from "react-router-dom";

export async function loader() {
    const vlss = await EIService.getVLSs();
    vlss.sort((v1, v2) => v1.group.year - v2.group.year);

    return vlss;
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
                                const loginsAndPasswords = await EIService.generatePasswords(vls.group._id);

                                console.log(loginsAndPasswords);
                            }}>Сгенерировать пароли
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