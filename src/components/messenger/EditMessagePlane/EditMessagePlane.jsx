import React, {useEffect, useState} from 'react';
import "./EditMessagePlane.css";
import CloseButton from "../../ui/CloseButton/CloseButton";

const EditMessagePlane = ({message, onCloseButtonClick}) => {
    const [editMessage, setEditMessage] = useState(message);

    useEffect(() => {
        setEditMessage(message);
    }, [message]);

    return (
        <div className="edit-plane">
            <div className="edit-plane__message-box">
                <p className="edit-plane__title">Редактирование сообщения</p>
                <p className="edit-plane__message-text">{editMessage.text}</p>
            </div>
            <div className="edit-plane__close-button-wrapper">
                <CloseButton className="edit-plane__button-close" onCloseButtonClick={onCloseButtonClick} />
            </div>
        </div>
    );
};

export default EditMessagePlane;