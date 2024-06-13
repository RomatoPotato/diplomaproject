import React, {useEffect, useRef, useState} from 'react';
import {Form, redirect, useActionData, useLoaderData} from "react-router-dom";
import "./ChangeUserData.css";
import UserService from "../../services/UserService";
import TextInput from "../../components/ui/TextInput/TextInput";
import PasswordInput from "../../components/ui/PasswordInput/PasswordInput";
import Button from "../../components/ui/Button/Button";

export async function action({request}) {
    const formData = await request.formData();

    const userId = formData.get("userId");
    const login = formData.get("login");
    const password = formData.get("password");
    let status = {};

    await UserService.updateLoginData(userId, login, password)
        .then(() => {
            status.value = "success";
        }).catch((err) => {
            let error = {}
            status.value = "error";
            status.data = error;

            const errorInfo = JSON.parse(err.response.data.message);

            if (errorInfo.error === "UserExisted"){
                error.login = `Пользователь с логином ${login} существует!`
            }
        });

    switch (status.value) {
        case "success":
            return redirect("../messenger");
        case "error":
            return status.data;
        default:
            return null;
    }
}

const ChangeUserData = () => {
    const user = useLoaderData();
    const actionData = useActionData();

    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loginError, setLoginError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);

    useEffect(() => {
        if (actionData?.login) {
            setLoginError(actionData.login);
        }else {
            setLoginError(false);
        }
    }, [actionData]);

    return (
        <div className="change_user_data">
            <h1>Добро пожаловать, {user.surname} {user.name}{user.middlename ? ` ${user.middlename}` : ""}!</h1>
            <h2>Измените данные для входа</h2>
            <Form
                method="post"
                className="change_user_data__form"
                onSubmit={(e) => {
                    if (password !== confirmPassword) {
                        setPasswordError("Пароли не совпадают!");
                        e.preventDefault();
                    }
                }}>
                <input type="hidden" name="userId" value={user._id}/>
                <TextInput
                    icon="../static/images/user-initials.png"
                    name="login"
                    required={true}
                    minLength="5"
                    value={login}
                    placeholder="Новый логин"
                    onFocus={() => {
                        setLoginError(false);
                    }}
                    onClearText={() => {
                        setLoginError(false);
                    }}
                    onChange={(value) => {
                        setLogin(value);
                    }}
                    errorData={loginError}/>
                <PasswordInput
                    value={password}
                    name="password"
                    placeholder="Новый пароль"
                    onChange={(value) => {
                        setPassword(value);
                    }}/>
                <PasswordInput
                    value={confirmPassword}
                    name="password"
                    placeholder="Повторите пароль"
                    errorData={passwordError}
                    onFocus={() => {
                        setPasswordError(false);
                    }}
                    onClearText={() => {
                        setPasswordError(false);
                    }}
                    onChange={(value) => {
                        setConfirmPassword(value);
                    }}/>
                <Button type="submit">Готово</Button>
            </Form>
        </div>
    );
};

export default ChangeUserData;