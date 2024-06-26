import React, {useEffect, useState} from 'react';
import './Login.css'
import {Form, redirect, useActionData} from "react-router-dom";
import AuthService from "../../services/AuthService";
import TextInput from "../../components/ui/TextInput/TextInput";
import Button from "../../components/ui/Button/Button";
import PasswordInput from "../../components/ui/PasswordInput/PasswordInput";

export async function action({request}) {
    const formData = await request.formData();
    const login = formData.get("login");
    const password = formData.get("password");
    let status = {};

    await AuthService.login(login, password)
        .then((value) => {
            status.value = "success";
            status.data = value.data;
        })
        .catch((err) => {
            let error = {};
            status.value = "error";
            status.data = error;

            const errorinfo = JSON.parse(err.response.data.message);

            switch (errorinfo.error) {
                case "WrongLogin":
                    error.login = `Пользователь ${errorinfo.data} не найден!`;
                    break;
                case "WrongPassword":
                    error.password = "Неверный пароль!";
                    break;
                default:
                    error = "Неизвестная ошибка...💩";
                    break;
            }

            return error;
        });

    switch (status.value) {
        case "success":
            if (status.data.isFirstLogin){
                return redirect("../change_user_data");
            }else {
                return redirect("../messenger");
            }
        case "error":
            return status.data;
        default:
            return null;
    }
}

const Login = () => {
    const actionData = useActionData();
    const [loginError, setLoginError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);

    useEffect(() => {
        if (actionData?.login) {
            setLoginError(actionData.login);
        }else {
            setLoginError(false);
        }

        if (actionData?.password){
            setPasswordError(actionData.password);
        }else {
            setPasswordError(false);
        }
    }, [actionData]);

    return (
        <div className="login-page">
            <h1>Добро пожаловать!</h1>
            <Form method="post" className="login-page__form">
                <TextInput
                    minLength={2}
                    required={true}
                    icon="../static/images/user-initials.png"
                    name="login"
                    autoFocus={true}
                    onFocus={() => {
                        setLoginError(false);
                    }}
                    onClearText={() => {
                        setLoginError(false);
                    }}
                    placeholder="Логин"
                    errorData={loginError}/>
                <PasswordInput
                    name="password"
                    placeholder="Пароль"
                    onFocus={() => {
                        setPasswordError(false);
                    }}
                    onClearText={() => {
                        setPasswordError(false);
                    }}
                    errorData={passwordError}/>
                <Button type="submit">Войти</Button>
            </Form>
        </div>
    );
};

export default Login;