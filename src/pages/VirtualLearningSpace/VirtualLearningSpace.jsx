import React from 'react';
import EIService from "../../services/EIService";
import {useLoaderData} from "react-router-dom";

export async function loader({params}){
    const vls = await EIService.getVLS(params.id);

    return vls;
}

const VirtualLearningSpace = () => {
    const vls = useLoaderData();

    return (
        <div>
            <h1>Виртуальное учебное пространство группы {vls.group.name}</h1>
            <p>Чаты</p>
            {
                vls.chats.map(chat =>
                    <div style={{border: "2px solid black"}}>
                        <p>{chat.name}</p>
                        {
                            chat.isMain && <i>Основной</i>
                        }
                    </div>)
            }
        </div>
    );
};

export default VirtualLearningSpace;