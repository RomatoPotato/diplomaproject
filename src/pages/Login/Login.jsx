import React, {useEffect, useRef, useState} from 'react';
import {Navigate} from "react-router-dom";
import './Login.css'

import {useAuth, useAuthDispatch} from "../../contexts/AuthContext";
import socket from "../../util/socket";
import authService from "../../services/AuthService";

const Login = () => {
    const [hasUser, setHasUser] = useState(true);

    const authDispatch = useAuthDispatch();
    const auth = useAuth();

    // useEffect(() => {
    //     let ignore = false;
    //
    //     if (login !== "") {
    //         (async () => {
    //             const user = authService.login();
    //
    //             if (user && !ignore) {
    //                 setHasUser(true);
    //
    //                 authDispatch({
    //                     type: "auth_succeed",
    //                     user: user
    //                 });
    //
    //                 socket.auth = {username: user.name, user: user}
    //                 socket.connect();
    //             } else {
    //                 setHasUser(false);
    //             }
    //         })();
    //     }
    //
    //     return () => {
    //         ignore = true;
    //     }
    // }, [ authDispatch]);

    if (auth?.user !== null) {
        return <Navigate to="/messenger"/>;
    }

    return (
        <div className="registration-form">
            <form onSubmit={async (e) => {
                e.preventDefault();
                const login = e.target.login.value;
                const password = e.target.password.value;

                //console.log(authService.checkAuth());

                const user = (await authService.login(login, password));

                if (user) {
                    setHasUser(true);

                    authDispatch({
                        type: "auth_succeed",
                        user: user
                    });
                }

            }}>
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
            </form>
            {/*{(!hasUser && login !== "") && <div className="error-message">Пользователя {login} не существует!</div>}*/}
        </div>
    );
};

export default Login;