import React, {useEffect, useState} from 'react';
import "./SelectMessagesPlane.css";
import CloseButton from "../../ui/CloseButton/CloseButton";
import ImageButton from "../../ui/ImageButton/ImageButton";

const SelectMessagesPlane = ({selectMode, onDeleteButtonClick, onCloseButtonClick}) => {
    const [messagesNumber, setMessagesNumber] = useState(null);

    useEffect(() => {
        setMessagesNumber(selectMode.messagesData?.length || 0);
    }, [selectMode.messagesData?.length]);

    return (
        <div className="select-plane">
            {(!messagesNumber || messagesNumber > 0) && messagesNumber !== 0 ?
                <p>Выбрано сообщений: {messagesNumber}</p> :
                <p>Выберите сообщения</p>
            }
            <div className="select-plane__actions">
                <ImageButton className="select-plane__action-button select-plane__button-delete" src="static/images/delete.png" onClick={onDeleteButtonClick} />
                <CloseButton className="select-plane__action-button" onCloseButtonClick={onCloseButtonClick} />
            </div>
        </div>
    );
};

export default SelectMessagesPlane;