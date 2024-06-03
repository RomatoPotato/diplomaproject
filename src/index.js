import React from 'react';
import ReactDOM from 'react-dom/client';
import "./style.css";
import socket from "./utils/socket";
import Messenger, {loader as messengerLoader} from "./pages/Messenger/Messenger";
import Login, {action as loginAction} from "./pages/Login/Login"
import {
    createBrowserRouter,
    redirect,
    RouterProvider,
} from "react-router-dom";
import authService from "./services/AuthService";
import AdminPage from "./pages/AdminPage/AdminPage";
import CreateVLS, {
    loader as createVLSLoader,
    action as createVLSAction
} from "./pages/CreateVLS/CreateVLS";
import CreateGroup, {
    loader as createGroupLoader,
    action as createGroupAction
} from "./pages/CreateGroup/CreateGroup";
import Specialties, {
    loader as specialtiesLoader,
    action as specialtiesAction
} from "./pages/Specilaties/Specialties";
import Groups, {
    loader as groupsLoader,
    action as groupsAction
} from "./pages/Groups/Groups";
import VLSList, {
    loader as VLSsLoader,
    action as VLSsAction
} from "./pages/VLSList/VLSList";
import VirtualLearningSpace, {
    loader as VLSLoader,
    action as VLSAction
} from "./pages/VirtualLearningSpace/VirtualLearningSpace";
import AccountPage from "./pages/AccountPage/AccountPage";
import ChangeUserData, {action as changeUserDataAction} from "./pages/ChangeUserData/ChangeUserData";
import Teachers, {
    loader as teachersLoader,
    action as teachersAction
} from "./pages/Teachers/Teachers";
import AcademicDisciplines, {
    loader as disciplinesLoader,
    action as disciplinesAction
} from "./pages/AcademicDisciplines/AcademicDisciplines";
import Curriculums, {
    loader as curriculumsLoader,
    action as curriculumsAction
} from "./pages/Curriculums/Curriculums";
import Admins, {
    loader as adminsModeratorsLoader,
    action as adminsModeratorsAction
} from "./pages/Admins/Admins";
import UniversityStaff, {
    loader as staffLoader,
    action as staffAction
} from "./pages/UniversityStaff/UniversityStaff";
import Curriculum, {loader as curriculumLoader} from "./pages/Curriculum/Curriculum";
import Group, {
    loader as groupLoader,
    action as groupAction
} from "./pages/Group/Group";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home/>,
        async loader() {
            const user = await authService.checkAuth();

            if (!user) {
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
        async loader() {
            const user = await authService.checkAuth();

            if (user) {
                return redirect("/messenger");
            }

            return null;
        },
        action: loginAction
    },
    {
        path: "change_user_data",
        element: <ChangeUserData/>,
        async loader() {
            return await authService.checkAuth();
        },
        action: changeUserDataAction
    },
    {
        path: "messenger",
        element: <Messenger/>,
        loader: messengerLoader
    },
    {
        path: "admin",
        element: <AdminPage/>,
        children: [
            {
                index: true,
                element: <div style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}><h2>Добро пожаловать в админ-панель!</h2></div>
            },
            {
                path: "create-vls",
                element: <CreateVLS/>,
                loader: createVLSLoader,
                action: createVLSAction
            },
            {
                path: "virtual-learning-spaces",
                element: <VLSList/>,
                loader: VLSsLoader,
                action: VLSsAction
            },
            {
                path: "virtual-learning-spaces/:id",
                element: <VirtualLearningSpace/>,
                loader: VLSLoader,
                action: VLSAction
            },
            {
                path: "create-group",
                element: <CreateGroup/>,
                loader: createGroupLoader,
                action: createGroupAction
            },
            {
                path: "groups",
                element: <Groups/>,
                loader: groupsLoader,
                action: groupsAction
            },
            {
                path: "groups/:id",
                element: <Group/>,
                loader: groupLoader,
                action: groupAction
            },
            {
                path: "specialties",
                element: <Specialties/>,
                loader: specialtiesLoader,
                action: specialtiesAction
            },
            {
                path: "teachers",
                element: <Teachers/>,
                loader: teachersLoader,
                action: teachersAction
            },
            {
                path: "academic_disciplines",
                element: <AcademicDisciplines/>,
                loader: disciplinesLoader,
                action: disciplinesAction
            },
            {
                path: "curriculums",
                element: <Curriculums/>,
                loader: curriculumsLoader,
                action: curriculumsAction
            },
            {
                path: "curriculums/:id",
                element: <Curriculum/>,
                loader: curriculumLoader
            },
            {
                path: "admins",
                element: <Admins/>,
                loader: adminsModeratorsLoader,
                action: adminsModeratorsAction
            },
            {
                path: "staff",
                element: <UniversityStaff/>,
                loader: staffLoader,
                action: staffAction
            }
        ]
    },
    {
        path: "account",
        element: <AccountPage/>,
        async loader() {
            const user = await authService.checkAuth();

            if (!user) {
                return redirect("/login");
            }

            return user;
        }
    }
]);

function Home() {
    return <></>
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>
);
