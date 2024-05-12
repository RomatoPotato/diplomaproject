import React, {useState} from 'react';
import "./DialogMenu.css";
import listener from "../../../utils/GlobalEventListeners/DialogMenuEventListener";

const DialogMenu = ({title, warningText, positiveButtonClick, negativeButtonClick}) => {
    const [isShown, setIsShown] = useState(false);
    const [receivedData, setReceivedData] = useState(null);

    const open = (e) => {
        setReceivedData(e.detail.data);
        setIsShown(true);
    }

    const close = () => {
        if (isShown) {
            setIsShown(false);
        }
    }

    listener.register(open, close);

    return (
        <div className="dialog-menu-blackout" style={{
            opacity: isShown ? 1 : 0,
            pointerEvents: isShown ? "all" : "none",
        }}>
            <div className="dialog-menu">
                <div className="dialog-menu__title">{title}</div>
                <div className="dialog-menu__warning-text">{warningText}</div>
                <div className="dialog-menu__buttons">
                    <div className="dialog-menu__action-buttons">
                        <button className="positive-button" onClick={() => {
                            positiveButtonClick(receivedData);
                            close();
                        }}>Да</button>
                        <button className="negative-button" onClick={() => {
                            negativeButtonClick ? negativeButtonClick() : close();
                        }}>Нет</button>
                    </div>
                    <button className="cancel-button" onClick={close}>Отменить</button>
                </div>
            </div>
        </div>
    );
};

export const show = (data) => {
    const eventShow = new CustomEvent("show_dm", {
        detail: {data}
    });
    window.dispatchEvent(eventShow);
}

export default DialogMenu;