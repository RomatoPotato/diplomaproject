import React, {useState} from 'react';
import "./DialogWindow.css";
import listener from "../../../utils/GlobalEventListeners/ShowModalsEventListener";
import Dialog from "../components/Dialog/Dialog";

const DialogWindow = ({name, title, warningText, positiveButtonClick, negativeButtonClick}) => {
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

    listener.register(name, open, close);

    return (
        <Dialog isShown={isShown} className="dialog-window">
            <div className="dialog-window__title">{title}</div>
            <div className="dialog-window__warning-text">{warningText}</div>
            <div className="dialog-window__buttons">
                <div className="dialog-window__action-buttons">
                    <button className="positive-button" onClick={() => {
                        positiveButtonClick(receivedData);
                        close();
                    }}>Да
                    </button>
                    <button className="negative-button" onClick={() => {
                        negativeButtonClick ? negativeButtonClick() : close();
                    }}>Нет
                    </button>
                </div>
                <button className="cancel-button" onClick={close}>Отменить</button>
            </div>
        </Dialog>
    );
};

export default DialogWindow;