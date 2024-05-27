import React from 'react';
import "./Button.css";

const Button = ({children, type, onClick, value, name, disabled, className}) => {
    return (
        <button
            name={name}
            disabled={disabled}
            type={type ? type : "button"}
            value={value}
            onClick={onClick}
            className={"better-button " + (className ? className : "")}>
            {children}
        </button>
    );
};

export default Button;