import React from 'react';
import ReactDOM from 'react-dom/client';
import "./style.css"
import Messenger, {loader as messengerLoader} from "./pages/Messenger/Messenger";
import Login from "./pages/Login/Login"
import {AuthProvider} from "./contexts/AuthContext";
import {
    createBrowserRouter,
    redirect,
    RouterProvider,
} from "react-router-dom";
import authService from "./services/AuthService";
import Chat from "./components/messenger/Chat/Chat";
import AdminPage from "./pages/AdminPage/AdminPage";
import CreateVLS, {action as createVLSAction} from "./pages/CreateVLS/CreateVLS";
import CreateGroup, {action as createGroupAction} from "./pages/CreateGroup/CreateGroup";
import Specialties, {loader as specialtiesLoader} from "./pages/Specilaties/Specialties";
import Groups, {loader as groupsLoader} from "./pages/Groups/Groups";
import VLSList, {loader as VLSsLoader} from "./pages/VLSList/VLSList";
import VirtualLearningSpace, {loader as VLSLoader} from "./pages/VirtualLearningSpace/VirtualLearningSpace";
import socket from "./util/socket";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home/>,
        async loader() {
            const user = await authService.checkAuth();

            if (!user){
                return redirect("/login");
            }
            socket.auth = {
                user: {
                    _id: user._id,
                    name: user.name,
                    surname: user.surname,
                    online: true
                }
            };
            socket.connect();

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
        loader: messengerLoader,
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
                element: <VLSList/>,
                loader: VLSsLoader
            },
            {
                path: "virtual-learning-spaces/:id",
                element: <VirtualLearningSpace/>,
                loader: VLSLoader
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
