import React, {useRef, useState} from 'react';
import {Form, redirect, useLoaderData} from "react-router-dom";
import "./ChangeUserData.css";
import UserService from "../../services/UserService";

export async function action({request}) {
    const formData = await request.formData();

    const userId = formData.get("userId");
    const login = formData.get("login");
    const password = formData.get("password");

    await UserService.updateLoginData(userId, login, password);

    return redirect("../messenger");
}

const ChangeUserData = () => {
    const user = useLoaderData();
    const passwordInput = useRef(null);

    const [changingPsw, setChangingPsw] = useState(false);
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");

    return (
        <div className="change_user_data">
            <h1>Добро пожаловать, {user.name} {user.surname}</h1>
            <h2>Измените данные для входа</h2>
            <Form method="post" className="change_user_data__form">
                <input type="hidden" name="userId" value={user._id}/>
                <label>Логин:&nbsp;
                    <input
                        type="text"
                        name="login"
                        required={true}
                        minLength="5"
                        value={login}
                        onChange={(e) => {
                            setLogin(e.target.value);
                        }}/>
                    <input type="button" onClick={() => {
                        setLogin(user.login);
                    }} value="Использовать тот же"/>
                </label>
                <label>Пароль:
                    <input
                        type="password"
                        value={password}
                        ref={passwordInput}
                        name="password"
                        required={true}
                        minLength="8"
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}/>
                    {
                        changingPsw ?
                            <input type="button" onClick={() => {
                                setChangingPsw(false);
                                passwordInput.current.type = "password";
                            }} value="❌"/> :
                            <input type="button" onClick={() => {
                                setChangingPsw(true);
                                passwordInput.current.type = "text";
                            }} value="👁️"/>
                    }
                    <input type="button" onClick={() => {
                        setPassword(user.login);
                    }} value="Использовать тот же"/>
                </label>
                <input type="submit" value="Готово"/>
            </Form>
        </div>
    );
};

export default ChangeUserData;