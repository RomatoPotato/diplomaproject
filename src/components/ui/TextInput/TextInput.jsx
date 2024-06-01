import React, {forwardRef, useEffect, useState} from 'react';
import "./TextInput.css";
import ImageButton from "../ImageButton/ImageButton";
import IconImage from "../IconImage/IconImage";

const TextInput = forwardRef((
    {
        className,
        icon,
        onChange,
        onClearText,
        noBorder,
        name,
        children,
        minLength,
        required,
        errorData,
        ...attrs
    }, ref) => {
    const [text, setText] = useState("");

    return (
        <div className={"custom-input " + (className || "") + (errorData ? "custom-input_hasError" : "")}>
            <div className="custom-input__wrapper">
                <div>
                    <ImageButton
                        className="custom-input__button-erase"
                        src="../../static/images/erase.png"
                        onClick={() => {
                            setText("");

                            if (onChange) {
                                onChange("");
                            }

                            if (onClearText) {
                                onClearText();
                            }
                        }}/>
                </div>
                {children}
                <input
                    minLength={minLength}
                    required={required}
                    name={name}
                    ref={ref}
                    type="text"
                    value={text}
                    className={"custom-input__input " +
                        (noBorder ? "custom-input__input_no-border" : "custom-input__input_with-border")}
                    spellCheck="false"
                    {...attrs}
                    onChange={(e) => {
                        setText(e.target.value);

                        if (onChange) {
                            onChange(e.target.value);
                        }
                    }}/>
                {icon &&
                    <IconImage
                        className="custom-input__icon"
                        alt="Иконка"
                        src={icon}/>
                }
            </div>
            {errorData &&
                <div className="custom-input__alert">
                    <p>{errorData}</p>
                </div>
            }
        </div>
    );
});

export default TextInput;