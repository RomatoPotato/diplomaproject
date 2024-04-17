import React, {useState} from 'react';
import {Form, redirect, useLoaderData} from "react-router-dom";
import "./CreateVLS.css";
import EIService from "../../services/EIService";

export async function action({request}){
    const formData = await request.formData();
    await EIService.addVLS(formData.get("groupId"));

    return redirect("../virtual-learning-spaces");
}

const CreateVLS = () => {
    const groups = useLoaderData();

    const [isGroupSelected, setIsGroupSelected] = useState(false);
    const [selectedGroupId, setSelectedGroupId] = useState(null);

    return (
        <div className="create-vls">
            <h1>Создание виртуального учебного пространства</h1>
            <Form method="post">
                <label>
                    Выберите группу:
                    <select
                        name="groupId"
                        onChange={(e) => {
                            const value = e.target.value;

                            if (value === "none") {
                                setIsGroupSelected(false);
                                return;
                            }

                            setIsGroupSelected(true);
                            setSelectedGroupId(e.target.value);
                        }}>
                        <option value="none">Не выбрано</option>
                        {groups.map(group =>
                            <option key={group._id} value={group._id}>{group.name}</option>
                        )}
                    </select>
                </label>
                <br/>
                <p>Участники:</p>
                <ul>
                    {isGroupSelected ?
                        groups.filter(group => group._id === selectedGroupId)[0].students.map(student =>
                            <li key={student._id}>{student.name} {student.surname}</li>
                        ) : <i>Пусто</i>
                    }
                </ul>
                <input type="submit" value="Готово"/>
            </Form>
        </div>
    );
};

export default CreateVLS;