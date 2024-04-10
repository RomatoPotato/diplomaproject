import React, {useRef, useState} from 'react';
import {Form, useLoaderData} from "react-router-dom";
import "./Specialties.css";

import EIService from "../../services/EIService";

export async function loader() {
    const specialties = await EIService.getSpecialties();
    specialties.sort((s1, s2) => {
        const name1 = s1.name.toLowerCase();
        const name2 = s2.name.toLowerCase();

        if (name1 < name2) return -1;
        if (name1 > name2) return 1;
        return 0;
    });

    return specialties;
}

const Specialties = () => {
    const [isAdding, setIsAdding] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [addedSpecialtyName, setAddedSpecialtyName] = useState("");
    const [editedSpecialtyName, setEditedSpecialtyName] = useState("");
    const editingId = useRef(null);

    const specialties = useLoaderData();

    return (
        <div className="specialties">
            <h1>Специальности</h1>
            <table>
                <thead>
                <tr>
                    <th>Наименование</th>
                    <th>Действия</th>
                </tr>
                </thead>
                <tbody>
                {specialties.map(specialty =>
                    <tr key={specialty._id}>
                        <td>
                            {
                                (isEditing && editingId.current === specialty._id) ?
                                    <Form onSubmit={async () => {
                                        setIsEditing(false);
                                        setEditedSpecialtyName("");

                                        if (specialty.name === editedSpecialtyName) return;

                                        await EIService.editSpecialty(specialty._id, editedSpecialtyName);
                                    }}>
                                        <input
                                            autoFocus
                                            value={editedSpecialtyName}
                                            onChange={(e) => setEditedSpecialtyName(e.target.value)} />
                                    </Form> :
                                    specialty.name
                            }
                        </td>
                        <td>
                            <Form style={{display: "inline"}}>
                                <button onClick={() => {
                                    setIsEditing(true);
                                    setEditedSpecialtyName(specialty.name);
                                    editingId.current = specialty._id;
                                }}>Редактировать
                                </button>
                            </Form>
                            <Form style={{display: "inline"}}>
                                <button onClick={async () => {
                                    await EIService.deleteSpecialty(specialty._id);
                                }}>Удалить
                                </button>
                            </Form>
                        </td>
                    </tr>
                )}
                {
                    isAdding &&
                    <tr>
                        <td colSpan={2}>
                            <Form onSubmit={async () => {
                                if (addedSpecialtyName !== "") {
                                    setIsAdding(false);
                                    setAddedSpecialtyName("");

                                   await EIService.addSpecialty(addedSpecialtyName);
                                }
                            }}>
                                <label>Название:&nbsp;
                                    <input
                                        autoFocus
                                        value={addedSpecialtyName}
                                        placeholder="Введите название специальности"
                                        onChange={(e) => setAddedSpecialtyName(e.target.value)}/>
                                </label>
                                <input type="button"
                                       value="Отмена"
                                       onClick={() => {
                                           setIsAdding(false);
                                           setAddedSpecialtyName("");
                                       }}/>
                            </Form>
                        </td>
                    </tr>
                }
                </tbody>
                <tfoot>
                <tr onClick={() => setIsAdding(true)}>
                    <td colSpan={2}>Добавить +</td>
                </tr>
                </tfoot>
            </table>
        </div>
    );
};

export default Specialties;