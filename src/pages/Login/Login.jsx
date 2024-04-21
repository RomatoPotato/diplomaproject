import React from 'react';
import './Login.css'
import {Form, redirect} from "react-router-dom";
import AuthService from "../../services/AuthService";

export async function action({request}){
    const formData = await request.formData();
    const login = formData.get("login");
    const password = formData.get("password");

    const loginRequest = await AuthService.login(login, password);

    if (loginRequest.status === 200){
        if (loginRequest.data.isFirstLogin){
            return redirect("../change_user_data");
        }

        return redirect("../messenger");
    }

    return null;
}

const Login = () => {
    return (
        <div className="registration-form">
            <Form method="post">
                <input
                    name="login"
                    autoFocus={true}
                    className="username-input"
                    placeholder="Введите свой наипрекраснейший логин" />
                <input
                    name="password"
                    type="password"
                    className="username-input"
                    placeholder="Введите наисекретнейший пароль" />
                <input type="submit"/>
            </Form>
            {/*{(!hasUser && login !== "") && <div className="error-message">Пользователя {login} не существует!</div>}*/}
        </div>
    );
};

export default Login;