import React from 'react';
import authService from "../../services/AuthService";
import {Form, useLoaderData, useNavigate} from "react-router-dom";
import "./AccountPage.css";

import user_icon from "../../images/user.png";

const AccountPage = () => {
    const user = useLoaderData();
    const navigate = useNavigate();

    let icon;

    if (!icon || icon === ""){
        icon = user_icon;
    }

    return (
        <div className="user-page">
            <h1>{user.name} {user.surname}</h1>
            <img className="user-icon" src={icon} alt="" />
            <Form onSubmit={async (e) => {
                e.preventDefault();
                await authService.logout();
                navigate("../login");
            }}>
                <input type="submit" value="Выйти"/>
            </Form>
        </div>
    );
};

export default AccountPage;