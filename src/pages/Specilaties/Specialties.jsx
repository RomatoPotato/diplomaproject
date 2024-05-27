import React, {useRef, useState} from 'react';
import {Form, useLoaderData} from "react-router-dom";
import "./Specialties.css";
import SpecialtiesService from "../../services/SpecialtiesService";
import Table, {TableActionCell, TableBody, TableCell, TableHead, TableRow} from "../../components/ui/Table/Table";
import ImageButton from "../../components/ui/ImageButton/ImageButton";
import Button from "../../components/ui/Button/Button";
import DialogWindow from "../../components/ui/DialogWindow/DialogWindow";
import RolesService from "../../services/RolesService";
import {show} from "../../utils/GlobalEventListeners/ShowModalsEventListener";
import TextInput from "../../components/ui/TextInput/TextInput";

export async function loader() {
    return await SpecialtiesService.getSpecialties();
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
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Наименование</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {specialties.map(specialty =>
                        <TableRow key={specialty._id}>
                            <TableActionCell text={specialty.name}>
                                {/*<Form style={{display: "inline"}}>*/}
                                {/*    <ImageButton*/}
                                {/*        className="button-table-action"*/}
                                {/*        src="../static/images/edit.png"*/}
                                {/*        onClick={() => {*/}
                                {/*            setIsEditing(true);*/}
                                {/*            setEditedSpecialtyName(specialty.name);*/}
                                {/*            editingId.current = specialty._id;*/}
                                {/*        }}/>*/}
                                {/*</Form>*/}
                                <Form style={{display: "inline"}}>
                                    <ImageButton
                                        className="button-table-action"
                                        src="../static/images/delete.png"
                                        onClick={() => {
                                            show("delete-specialty-dialog", specialty);
                                        }}/>
                                </Form>
                                {/*{*/}
                                {/*    (isEditing && editingId.current === specialty._id) ?*/}
                                {/*        <Form onSubmit={async () => {*/}
                                {/*            setIsEditing(false);*/}
                                {/*            setEditedSpecialtyName("");*/}

                                {/*            if (specialty.name === editedSpecialtyName) return;*/}

                                {/*            await SpecialtiesService.editSpecialty(specialty._id, editedSpecialtyName);*/}
                                {/*        }}>*/}
                                {/*            <input*/}
                                {/*                autoFocus*/}
                                {/*                value={editedSpecialtyName}*/}
                                {/*                onChange={(e) => setEditedSpecialtyName(e.target.value)}/>*/}
                                {/*        </Form> :*/}
                                {/*        specialty.name*/}
                                {/*}*/}
                            </TableActionCell>
                        </TableRow>
                    )}
                    {
                        isAdding &&
                        <TableRow>
                            <TableCell colSpan={2}>
                                <Form className="specialties__create-form" onSubmit={async () => {
                                    if (addedSpecialtyName !== "") {
                                        setIsAdding(false);
                                        setAddedSpecialtyName("");

                                        await SpecialtiesService.addSpecialty(addedSpecialtyName);
                                    }
                                }}>
                                    <span>Название:&nbsp;</span>
                                    <TextInput
                                        autoFocus
                                        value={addedSpecialtyName}
                                        placeholder="Введите название специальности"
                                        onChange={(value) => setAddedSpecialtyName(value)}/>
                                    <Button
                                        onClick={() => {
                                            setIsAdding(false);
                                            setAddedSpecialtyName("");
                                        }}>Отмена</Button>
                                </Form>
                            </TableCell>
                        </TableRow>
                    }
                </TableBody>
            </Table>
            <Button
                disabled={isAdding}
                className="button-add-specialty"
                onClick={() => setIsAdding(true)}>
                Создать
            </Button>
            <Form className="admin-modals">
                <DialogWindow
                    confirmType="submit"
                    name="delete-specialty-dialog"
                    title="Удалить специальность?"
                    warningText={(specialty) => `Вы удалите специальность: ${specialty?.name}`}
                    positiveButtonClick={async (specialty) => {
                        await SpecialtiesService.deleteSpecialty(specialty._id);
                    }}/>
            </Form>
        </div>
    );
};

export default Specialties;