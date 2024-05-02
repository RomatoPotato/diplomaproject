import React from 'react';
import {Form, Outlet} from "react-router-dom";
import "./AdminPage.css";

const AdminPage = () => {
    return (
        <div className="admin-page">
            <div className="menu">
                <div className="menu-topbar">
                    <p>Филиал УГАТУ в г.Ишимбае</p>
                    <p>Админ Админовна</p>
                </div>
                <div className="menu-buttons">
                    <p>Виртуальные учебные пространства</p>
                    <Form action="virtual-learning-spaces">
                        <input type="submit" value="Список" />
                    </Form>
                    <Form action="create-vls">
                        <input type="submit" value="Создать пространство" />
                    </Form>
                    <Form action="admins">
                        <input type="submit" value="Админы" />
                    </Form>
                    <p>Группы</p>
                    <Form action="groups">
                        <input type="submit" value="Все группы" />
                    </Form>
                    <Form action="create-group">
                        <input type="submit" value="Добавить группу" />
                    </Form>
                    <Form action="specialties">
                        <input type="submit" value="Специальности" />
                    </Form>
                    <p>ВУЗ</p>
                    <Form action="teachers">
                        <input type="submit" value="Преподаватели" />
                    </Form>
                    <Form action="academic_disciplines">
                        <input type="submit" value="Учебные дисциплины" />
                    </Form>
                    <Form action="curriculums">
                        <input type="submit" value="Учебные планы" />
                    </Form>
                    <Form action="staff">
                        <input type="submit" value="Сотрудники университета" />
                    </Form>
                </div>
            </div>
            <div className="content">
                <Outlet />
            </div>
        </div>
    );
};

export default AdminPage;