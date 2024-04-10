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
                        <button type="submit">Список</button>
                    </Form>
                    <Form action="create-vls">
                        <button type="submit">Создать пространство</button>
                    </Form>
                    <p>Группы</p>
                    <Form action="groups">
                        <button type="submit">Все группы</button>
                    </Form>
                    <Form action="create-group">
                        <button type="submit">Добавить группу</button>
                    </Form>
                    <Form action="specialties">
                        <button type="submit">Специальности</button>
                    </Form>
                </div>
            </div>
            <Outlet />
        </div>
    );
};

export default AdminPage;