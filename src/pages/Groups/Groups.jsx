import React from 'react';
import {Form, useLoaderData} from "react-router-dom";
import GroupsService from "../../services/GroupsService";
import Table, {TableBody, TableCell, TableHead, TableRow} from "../../components/ui/Table/Table";
import DialogWindowForm from "../../components/ui/DialogWindowForm/DialogWindowForm";
import ImageButton from "../../components/ui/ImageButton/ImageButton";
import {show} from "../../utils/GlobalEventListeners/ShowModalsEventListener";

export async function loader() {
    return await GroupsService.getGroups();
}

export async function action({request}){
    const formData = await request.formData();
    const intent = formData.get("intent");

    switch (intent){
        case "deleteGroup":
            const groupId = formData.get("group_id");
            return await GroupsService.deleteGroup(groupId);
        default:
            return null;
    }
}

const Groups = () => {
    const groups = useLoaderData();

    return (
        <div className="specialties">
            <h1>Группы</h1>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Курс</TableCell>
                        <TableCell>Наименование</TableCell>
                        <TableCell>Специальность</TableCell>
                        <TableCell>Действия</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {groups.map(group =>
                        <TableRow key={group._id}>
                            <TableCell>{group.year}</TableCell>
                            <TableCell>{group.name}</TableCell>
                            <TableCell>{group.specialty.name}</TableCell>
                            <TableCell>
                                <ImageButton
                                    className="button-table-action"
                                    src="../static/images/delete.png"
                                    onClick={() => {
                                        show("delete-group-dialog", group);
                                    }}/>
                                <Form action={group._id}>
                                    <ImageButton
                                        type="submit"
                                        src="../static/images/open.png"
                                        className="button-table-action"/>
                                </Form>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <div className="admin-modals">
                <DialogWindowForm
                    name="delete-group-dialog"
                    title="Удалить группу со всеми студентами?"
                    warningText={(group) => `Будет удалена группа ${group?.name} с ${group?.students.length} студентами`}
                    actions={(group) => [
                        {name: "intent", value : "deleteGroup"},
                        {name: "group_id", value : group._id}
                    ]}/>
            </div>
        </div>
    );
};

export default Groups;