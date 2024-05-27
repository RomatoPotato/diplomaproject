import React, {useState} from 'react';
import {Form, redirect, useLoaderData} from "react-router-dom";
import "./CreateVLS.css";
import VLSService from "../../services/VLSService";
import GroupsService from "../../services/GroupsService";
import RolesService from "../../services/RolesService";
import Table, {TableActionCell, TableBody, TableCell, TableHead, TableRow} from "../../components/ui/Table/Table";
import BetterSelect from "../../components/ui/BetterSelect/BetterSelect";
import ImageButton from "../../components/ui/ImageButton/ImageButton";
import Button from "../../components/ui/Button/Button";
import DialogWindow from "../../components/ui/DialogWindow/DialogWindow";
import AdminManager from "../../utils/AdminManager";
import {show} from "../../utils/GlobalEventListeners/ShowModalsEventListener";

export async function loader() {
    const groups = await GroupsService.getGroups();
    const adminsList = await RolesService.getUsersByRoles(["admin"]);

    return [groups, adminsList];
}

export async function action({request}) {
    const formData = await request.formData();
    const groupId = formData.get("groupId");
    const admins = formData.getAll("admins");

    await VLSService.addVLS(groupId, admins);

    return redirect("../virtual-learning-spaces");
}

const CreateVLS = () => {
    const [groups, adminsList] = useLoaderData();

    const [isGroupSelected, setIsGroupSelected] = useState(false);
    const [selectedGroupId, setSelectedGroupId] = useState(null);
    const [admins, setAdmins] = useState(adminsList);

    return (
        <div className="create-vls">
            <h1>Создание виртуального учебного пространства</h1>
            <Form method="post">
                <p>Выберите группу:</p>
                <BetterSelect
                    defaultElement={{text: "Не выбрано", value: ""}}
                    name="groupId"
                    onChange={(value) => {
                        if (!value) {
                            setIsGroupSelected(false);
                            return;
                        }

                        setIsGroupSelected(true);
                        setSelectedGroupId(value);
                        setAdmins(adminsList);
                    }}
                    elements={groups.map(group =>
                        ({text: group.name, value: group._id})
                    )}>
                </BetterSelect>
                {isGroupSelected &&
                    <>
                        <h2>Участники</h2>
                        <h3>Куратор</h3>
                        {groups.filter(group => group._id === selectedGroupId).map(group =>
                            <h4 key={group.curator._id}>{group.curator.surname} {group.curator.name} {group.curator.middlename}</h4>
                        )}
                        <h3>Студенты</h3>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ФИО</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {groups.filter(group => group._id === selectedGroupId)[0].students.map(student =>
                                    <TableRow key={student._id}>
                                        <TableCell>
                                            {student.surname} {student.name}{student.middlename && ` ${student.middlename}`}
                                            {student.roles.includes("headman") &&
                                                <b><i>&nbsp;(Староста)</i></b>
                                            }
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                        <h3>Админы</h3>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ФИО</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {admins.map(admin =>
                                    <TableRow key={admin._id}>
                                        <TableActionCell text={`${admin.surname} ${admin.name} ${admin.middlename}`}>
                                            <input type="hidden" name="admins" value={admin._id}/>
                                            <ImageButton
                                                className="button-table-action"
                                                src="../static/images/delete.png"
                                                onClick={() => {
                                                    show("remove-admin-dialog", admin);
                                                }}/>
                                        </TableActionCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </>
                }
                <Button
                    disabled={!isGroupSelected}
                    className="button-create-group"
                    type="submit">
                    Готово
                </Button>
            </Form>
            <div className="admin-modals">
                <DialogWindow
                    name="remove-admin-dialog"
                    title="Убрать админа?"
                    warningText={(admin) => `Из списка будет убран админ ${admin?.surname} ${admin?.name} ${admin?.middlename}`
                        + ", вы не сможете вернуть его обратно!"}
                    positiveButtonClick={(admin) => {
                        setAdmins(admins.filter(a => a._id !== admin._id));
                    }}/>
            </div>
        </div>
    );
};

export default CreateVLS;