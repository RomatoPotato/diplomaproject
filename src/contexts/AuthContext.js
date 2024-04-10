import {createContext, useContext, useEffect, useReducer} from "react";
import authService from "../services/AuthService";

const initial_state = {
    user: null,
    isFetching: false,
    hasError: false
}

const AuthContext = createContext(null);
const AuthDispatchContext = createContext(null);

export function AuthProvider({children}){
    const [state, dispatch] = useReducer(authReducer, initial_state);

    return (
        <AuthContext.Provider value={state}>
            <AuthDispatchContext.Provider value={dispatch}>
                {children}
            </AuthDispatchContext.Provider>
        </AuthContext.Provider>
    )
}

export function useAuth(){
    return useContext(AuthContext);
}

export function useAuthDispatch(){
    return useContext(AuthDispatchContext);
}

function authReducer(state, action){
    switch (action.type){
        case "auth_started":
            return {
                user: null,
                isFetching: true,
                hasError: false
            }
        case "auth_succeed":
            return {
                user: action.user,
                isFetching: false,
                hasError: false
            }
        case "auth_failed":
            return {
                user: null,
                isFetching: false,
                hasError: true
            }
        default:
            return null;
    }
}