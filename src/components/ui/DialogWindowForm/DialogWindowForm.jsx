import React, {useState} from 'react';
import "./DialogWindowForm.css";
import listener from "../../../utils/GlobalEventListeners/ShowModalsEventListener";
import Dialog from "../components/Dialog/Dialog";
import {Form} from "react-router-dom";

const DialogWindowForm = ({name, title, warningText, actions}) => {
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
            <div className="dialog-window__warning-text">{
                typeof warningText === "function" ? warningText(receivedData) : warningText
            }</div>
            <div className="dialog-window__buttons">
                <div className="dialog-window__action-buttons-box">
                    <Form method="post" className="dialog-window__form">
                        {receivedData && actions(receivedData).map(action =>
                            <input key={action.name} type="hidden" name={action.name} value={action.value}/>
                        )}
                        <button
                            className="positive-button"
                            onClick={() => {
                                close();
                            }}>Да
                        </button>
                    </Form>
                    <button
                        type="button"
                        className="negative-button"
                        onClick={close}>
                        Нет
                    </button>
                </div>
                <button
                    type="button"
                    className="neutral-button"
                    onClick={close}>
                    Отменить
                </button>
            </div>
        </Dialog>
    );
};

export default DialogWindowForm;