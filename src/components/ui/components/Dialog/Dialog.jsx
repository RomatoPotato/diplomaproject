import React from 'react';
import "./Dialog.css";

const Dialog = ({isShown, children, className,...attrs}) => {
    return (
        <div className="dialog">
            <div className="dialog__backdrop" style={{
                opacity: isShown ? 1 : 0,
                pointerEvents: isShown ? "all" : "none",
            }}>
                <div className={"dialog__content " + className} {...attrs}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Dialog;