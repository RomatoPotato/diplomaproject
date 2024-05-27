import React, {forwardRef, useState} from 'react';
import "./TextInput.css";
import ImageButton from "../ImageButton/ImageButton";
import IconImage from "../IconImage/IconImage";

const TextInput = forwardRef(({className, icon, onChange, onClearText, noBorder, name, children, ...attrs}, ref) => {
    const [text, setText] = useState("");

    return (
        <div className={"custom-input " + (className || "")}>
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
    );
});

export default TextInput;