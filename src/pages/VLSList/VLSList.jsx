import React from 'react';
import "./VLSList.css";
import {Form, useLoaderData} from "react-router-dom";
import VLSService from "../../services/VLSService";
import AdminManager from "../../utils/AdminManager";
import Table, {TableActionCell, TableBody, TableCell, TableHead, TableRow} from "../../components/ui/Table/Table";
import ImageButton from "../../components/ui/ImageButton/ImageButton";
import DialogWindow from "../../components/ui/DialogWindow/DialogWindow";
import {show} from "../../utils/GlobalEventListeners/ShowModalsEventListener";

export async function loader() {
    return await VLSService.getVLSs();
}

export async function action({request}){

}

const VLSList = () => {
    const vlss = useLoaderData();

    return (
        <div className="vls-list">
            <h1>Виртуальные учебные пространства</h1>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Группа</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {vlss.map(vls =>
                        <TableRow key={vls._id}>
                            <TableActionCell text={vls.group.name}>
                                <ImageButton
                                    className="button-table-action"
                                    src="../static/images/gen_psw_icon.png"
                                    onClick={() => {
                                        show("generate-psw-dialog", vls);
                                    }}/>
                                <ImageButton
                                    className="button-table-action"
                                    src="../static/images/delete.png"
                                    onClick={() => {
                                        show("delete-vls-dialog", vls);
                                    }}/>
                                <Form action={vls._id}>
                                    <ImageButton
                                        type="submit"
                                        src="../static/images/open.png"
                                        className="button-table-action"/>
                                </Form>
                            </TableActionCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <Form className="admin-modals">
                <DialogWindow
                    name="generate-psw-dialog"
                    title="Продолжить?"
                    warningText={(vls) => "Будут сгенерированы пароли для студентов группы " + vls?.group.name}
                    positiveButtonClick={async (vls) => {
                        await AdminManager.generateLoginAndPasswordForMany(vls.group.students, `Логины и пароли для студентов группы ${vls.group.name}.txt`);
                    }}/>
                <DialogWindow
                    confirmType="submit"
                    name="delete-vls-dialog"
                    title="Удалить ВУП?"
                    warningText={(vls) => "Будет удалено учебное пространство группы " + vls?.group.name}
                    positiveButtonClick={async (vls) => {
                        await VLSService.deleteVLS(vls._id);
                    }}/>
            </Form>
        </div>
    );
};

export default VLSList;