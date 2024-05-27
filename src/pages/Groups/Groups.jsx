import React from 'react';
import {Form, useLoaderData} from "react-router-dom";
import GroupsService from "../../services/GroupsService";
import Table, {TableBody, TableCell, TableHead, TableRow} from "../../components/ui/Table/Table";
import DialogWindow from "../../components/ui/DialogWindow/DialogWindow";
import ImageButton from "../../components/ui/ImageButton/ImageButton";
import {show} from "../../utils/GlobalEventListeners/ShowModalsEventListener";

export async function loader() {
    return await GroupsService.getGroups();
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
                        {/*<th>Студенты</th>*/}
                        {/*<th>Куратор</th>*/}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {groups.map(group =>
                        <TableRow key={group._id}>
                            <TableCell>{group.year}</TableCell>
                            <TableCell>{group.name}</TableCell>
                            <TableCell>{group.specialty.name}</TableCell>
                            {/*<TableCell>*/}
                            {/*    <div>*/}
                            {/*        {group.students.map(student =>*/}
                            {/*            <p key={student._id}>*/}
                            {/*                {student.surname} {student.name}{student.middlename && ` ${student.middlename}`}*/}
                            {/*                {student.roles.map(role => role === "headman" &&*/}
                            {/*                    <b key={role}><i> (Староста)</i></b>*/}
                            {/*                )}*/}
                            {/*            </p>*/}
                            {/*        )}*/}
                            {/*    </div>*/}
                            {/*</TableCell>*/}
                            {/*<TableCell>{group.curator.surname} {group.curator.name} {group.curator.middlename}</TableCell>*/}
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
            <Form className="admin-modals">
                <DialogWindow
                    confirmType="submit"
                    name="delete-group-dialog"
                    title="Удалить группу со всеми студентами?"
                    warningText={(group) => `Будет удалена группа ${group?.name} с ${group?.students.length} студентами`}
                    positiveButtonClick={async (group) => {
                        await GroupsService.deleteGroup(group._id);
                    }}/>
            </Form>
        </div>
    );
};

export default Groups;