import React from 'react';
import ReactDOM from 'react-dom/client';
import "./style.css"
import Messenger from "./pages/Messenger/Messenger";
import Login from "./pages/Login/Login"
import {AuthProvider} from "./contexts/AuthContext";
import {
    createBrowserRouter,
    redirect,
    RouterProvider,
} from "react-router-dom";
import authService from "./services/AuthService";
import Chat from "./components/messenger/Chat/Chat";
import socket from "./util/socket";
import AdminPage from "./pages/AdminPage/AdminPage";
import CreateVLS, {action as createVLSAction} from "./pages/CreateVLS/CreateVLS";
import CreateGroup, {action as createGroupAction} from "./pages/CreateGroup/CreateGroup";
import Specialties, {loader as specialtiesLoader} from "./pages/Specilaties/Specialties";
import Groups, {loader as groupsLoader} from "./pages/Groups/Groups";
import VirtualLearningSpaces, {loader as VLSsLoader} from "./pages/VirtualLearingSpaces/VirtualLearningSpaces";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home/>,
        async loader() {
            const user = await authService.checkAuth();

            if (!user){
                return redirect("/login");
            }

            return redirect("/messenger");
        }
    },
    {
        path: "login",
        element: <Login/>,
        async loader(){
            const user = await authService.checkAuth();

            if (user){
                return redirect("/messenger");
            }

            return null;
        }
    },
    {
        path: "messenger",
        element: <Messenger/>,
        async loader(){
            const user = await authService.checkAuth();

            if (!user){
                return redirect("/login");
            }

            socket.auth = {
                user
            };

            socket.connect();

            return user;
        },
        children: [
            {
                index: true,
                element: <p>Choose contact</p>
            },
            {
                path: ":userId",
                element: <Chat />
            }
        ]
    },
    {
        path: "admin",
        element: <AdminPage />,
        children: [
            {
                path: "create-vls",
                element: <CreateVLS />,
                loader: groupsLoader,
                action: createVLSAction
            },
            {
                path: "virtual-learning-spaces",
                element: <VirtualLearningSpaces/>,
                loader: VLSsLoader
            },
            {
                path: "create-group",
                element: <CreateGroup />,
                loader: specialtiesLoader,
                action: createGroupAction
            },
            {
                path: "groups",
                element: <Groups />,
                loader: groupsLoader
            },
            {
                path: "specialties",
                element: <Specialties />,
                loader: specialtiesLoader
            }
        ]
    }
]);

function Home() {
    return <></>
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <AuthProvider>
            <RouterProvider router={router}/>
        </AuthProvider>
    </React.StrictMode>
);
