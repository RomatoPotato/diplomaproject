import React from 'react';
import "./Window.css";

const Window = ({onCloseWindow, name, className, children}) => {
    return (
        <div className="window-close-area" onClick={onCloseWindow}>
            <div className={"window " + className} onClick={(e) => e.stopPropagation()}>
                <div className="window__header">
                    <h1>{name}</h1>
                    <button className=" window__close-button" onClick={onCloseWindow}></button>
                </div>
                <div className="content">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Window;