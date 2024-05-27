import React, {useState} from 'react';
import "./AcademicDisciplines.css";
import {Form, useActionData, useLoaderData} from "react-router-dom";
import ADService from "../../services/ADService";
import TextInput from "../../components/ui/TextInput/TextInput";
import Button from "../../components/ui/Button/Button";
import Table, {TableActionCell, TableBody, TableCell, TableHead, TableRow} from "../../components/ui/Table/Table";
import ImageButton from "../../components/ui/ImageButton/ImageButton";
import {show} from "../../utils/GlobalEventListeners/ShowModalsEventListener";
import DialogWindow from "../../components/ui/DialogWindow/DialogWindow";

export async function loader() {
    return await ADService.getAcademicDisciplines();
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
            break;
        default:
            return null;
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
                <span>Наименование:&nbsp;</span>
                <TextInput
                    name="disciplineName"
                    value={name}
                    onChange={(value) => setName(value)}
                    autoFocus={true}/>
                <Button
                    className="button-add-discipline"
                    type="submit"
                    name="intent"
                    value="add">
                    Готово
                </Button>
            </Form>
            {/*{*/}
            {/*    actionData?.error && <b style={{color: "indianred"}}>{actionData.error}</b>*/}
            {/*}*/}
            {/*{*/}
            {/*    actionData?.addedDiscipline &&*/}
            {/*    <b style={{color: "forestgreen"}}>Добавлено: {actionData.addedDiscipline.name}</b>*/}
            {/*}*/}
            <h2>Список дисциплин</h2>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>№</TableCell>
                        <TableCell>Наименование</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {academicDisciplines.map((discipline, index) =>
                        <TableRow key={discipline._id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableActionCell text={discipline.name}>
                                <ImageButton
                                    className="button-table-action"
                                    src="../static/images/delete.png"
                                    onClick={() => {
                                        show("delete-discipline-dialog", discipline);
                                    }}/>
                            </TableActionCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <Form className="admin-modals">
                <DialogWindow
                    confirmType="submit"
                    name="delete-discipline-dialog"
                    title="Удалить дисциплину?"
                    warningText={(discipline) => `Вы удаляете учебную дисциплину: ${discipline?.name}`}
                    positiveButtonClick={async (discipline) => {
                        await ADService.deleteAcademicDiscipline(discipline._id);
                    }}/>
            </Form>
        </div>
    );
};

export default AcademicDisciplines;