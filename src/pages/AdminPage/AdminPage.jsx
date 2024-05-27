import React from 'react';
import {NavLink, Outlet} from "react-router-dom";
import "./AdminPage.css";

const AdminPage = () => {
    return (
        <div className="admin-page">
            <div className="admin-page__left-side">
                <div className="admin-page__user-info">
                    <p>Филиал УУНиТ в г.Ишимбае</p>
                    <p>Админ Админовна</p>
                </div>
                <div className="admin-menu">
                    <div className="admin-menu__section">
                        <p>Виртуальные учебные пространства</p>
                        <AdminMenuItem to="virtual-learning-spaces">Список</AdminMenuItem>
                        <AdminMenuItem to="create-vls">Создать пространство</AdminMenuItem>
                        <AdminMenuItem to="admins">Админы</AdminMenuItem>
                    </div>
                    <div className="admin-menu__section">
                        <p>Группы</p>
                        <AdminMenuItem to="groups">Все группы</AdminMenuItem>
                        <AdminMenuItem to="create-group">Добавить группу</AdminMenuItem>
                        <AdminMenuItem to="specialties">Специальности</AdminMenuItem>
                    </div>
                    <div className="admin-menu__section">
                        <p>ВУЗ</p>
                        <AdminMenuItem to="teachers">Преподаватели</AdminMenuItem>
                        <AdminMenuItem to="academic_disciplines">Учебные дисциплины</AdminMenuItem>
                        <AdminMenuItem to="curriculums">Учебные планы</AdminMenuItem>
                        <AdminMenuItem to="staff">Сотрудники университета</AdminMenuItem>
                    </div>
                </div>
            </div>
            <div className="admin-page__content">
                <Outlet/>
            </div>
        </div>
    );
};

const AdminMenuItem = ({to, children}) => {
    return (
        <NavLink
            className={({isActive, isPending}) =>
                isActive ? "admin-menu__item admin-menu__item_active"
                    : isPending ? "admin-menu__item admin-menu__item_pending" : "admin-menu__item"
            }
            to={to}>
            {children}
        </NavLink>
    )
}

export default AdminPage;