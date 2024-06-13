import React, {useState} from 'react';
import Dialog from "../components/Dialog/Dialog";
import listener from "../../../utils/GlobalEventListeners/ShowModalsEventListener";
import IconImage from "../IconImage/IconImage";
import "./DialogAlert.css";
import Button from "../Button/Button";

const DialogAlert = ({name, title, warningText}) => {
    const [isShown, setIsShown] = useState(false);

    const open = () => {
        setIsShown(true);
    }

    const close = () => {
        if (isShown){
            setIsShown(false);
        }
    }

    listener.register(name, open, close);

    return (
        <Dialog isShown={isShown} className="dialog-alert">
            <div className="dialog-alert__top">
                <IconImage className="dialog-alert__icon" src="../static/images/info.png" />
                <div>{warningText}</div>
            </div>
            <div className="dialog-alert__title">{title}</div>
            <button className="positive-button" onClick={close}>Хорошо</button>
        </Dialog>
    );
};

export default DialogAlert;