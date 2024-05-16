import React, {useEffect, useState} from 'react';
import "./SelectMessagesPlane.css";

const SelectMessagesPlane = ({selectMode, onDeleteButtonClick, onCloseButtonClick}) => {
    const [messagesNumber, setMessagesNumber] = useState(0);

    useEffect(() => {
        setMessagesNumber(selectMode.messages?.length || 0);
    }, [selectMode.messages?.length]);

    return (
        <div className="select-plane">
            {messagesNumber === 0 ?
                <p>Выберите сообщения</p> :
                <p>Выбрано сообщений: {messagesNumber}</p>
            }
            <div className="select-plane__actions">
                <button onClick={onDeleteButtonClick}>Удалить</button>
                <button className="close-button" onClick={onCloseButtonClick}></button>
            </div>
        </div>
    );
};

export default SelectMessagesPlane;