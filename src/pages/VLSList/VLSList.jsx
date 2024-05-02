import React from 'react';
import {Form, useLoaderData} from "react-router-dom";
import VLSService from "../../services/VLSService";

export async function loader() {
    const vlss = await VLSService.getVLSs();

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
                                const loginsAndPasswords = await VLSService.generatePasswords(vls.group._id);

                                const dataToSave = [];
                                for (const data of loginsAndPasswords) {
                                    dataToSave.push(`${data.student}\nЛогин: ${data.login}\nПароль: ${data.password}\n\n`);
                                }

                                const file = new Blob(dataToSave, {type: "text/plain"});
                                const element = document.createElement("a");
                                element.href = URL.createObjectURL(file, { oneTimeOnly: true });
                                element.download = `Логины и пароли для студентов группы ${vls.group.name}.txt`;
                                element.click();

                                console.log(loginsAndPasswords);
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