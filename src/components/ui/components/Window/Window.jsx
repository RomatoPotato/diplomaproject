import React, {useRef, useState} from 'react';
import "./Window.css";
import CloseButton from "../../CloseButton/CloseButton";
import listener from "../../../../utils/GlobalEventListeners/ShowModalsEventListener";

const Window = ({name, className, children}) => {
    const [isShown, setIsShown] = useState(false);
    const windowContentRef = useRef();

    const open = () => {
        setIsShown(true);
    }

    const close = () => {
        if (isShown) {
            setIsShown(false);
        }
    }

    const closeOnOutsideClick = (e) => {
        if (isShown) {
            if (!windowContentRef.current.contains(e.target)) {
                setIsShown(false);
            }
        }
    }

    listener.register(name, open, close);

    return (
        <div className="window">
            <div
                className="window__backdrop"
                onClick={closeOnOutsideClick}
                style={{
                    opacity: isShown ? 1 : 0,
                    pointerEvents: isShown ? "all" : "none",
                }}>
                <div
                    ref={windowContentRef}
                    className={"window__content " + className}>
                    <div className="window__header">
                        <h1>{name}</h1>
                        <CloseButton className="window__button-close" onCloseButtonClick={close}></CloseButton>
                    </div>
                    <div className="content">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Window;