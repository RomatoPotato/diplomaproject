import React, {useState} from 'react';
import {Form, useActionData, useLoaderData} from "react-router-dom";
import ADService from "../../services/ADService";

export async function loader() {
    const academicDisciplines = await ADService.getAcademicDisciplines();

    return academicDisciplines;
}

export async function action({request}) {
    const formData = await request.formData();
    const intent = formData.get("intent");

    let addedDiscipline;
    let error;

    switch (intent) {
        case "add":
            const name = formData.get("disciplineName");

            await ADService.addAcademicDiscipline(name)
                .then((data) => {
                    addedDiscipline = data;
                }).catch((err) => {
                    if (err.response.status === 500) {
                        error = "Данная дисциплина уже существует!";
                    }
                });
    }

    return {
        addedDiscipline,
        error
    };
}

const AcademicDisciplines = () => {
    const academicDisciplines = useLoaderData();
    const [name, setName] = useState("");

    const actionData = useActionData();

    return (
        <div>
            <h1>Учебные дисциплины</h1>
            <h2>Добавить</h2>
            <Form method="post" onSubmit={() => setName("")}>
                <input type="hidden" name="action" value="add"/>
                <label>
                    Наименование:&nbsp;
                    <input
                        name="disciplineName"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoFocus={true}/>
                </label>
                <br/>
                <br/>
                <button type="submit" name="intent" value="add">Готово</button>
            </Form>
            {
                actionData?.error && <b style={{color: "indianred"}}>{actionData.error}</b>
            }
            {
                actionData?.addedDiscipline && <b style={{color: "forestgreen"}}>Добавлено: {actionData.addedDiscipline}</b>
            }
            <table>
                <thead>
                <tr>
                    <th>№</th>
                    <th>Наименование</th>
                </tr>
                </thead>
                <tbody>
                {academicDisciplines.map((discipline, index) =>
                    <tr key={discipline._id}>
                        <td>{index + 1}</td>
                        <td>{discipline.name}</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default AcademicDisciplines;