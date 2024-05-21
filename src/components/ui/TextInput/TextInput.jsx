import React, {useRef, useState} from 'react';
import "./TextInput.css";
import ImageButton from "../ImageButton/ImageButton";
import IconImage from "../IconImage/IconImage";

const TextInput = ({className, icon, onChange, onClearText, noBorder, children, ...attrs}) => {
    const [text, setText] = useState("");
    const inputRef = useRef();

    return (
        <div className={"custom-input " + (className || "")}>
            <div>
                <ImageButton
                    className="custom-input__button-erase"
                    src="static/images/erase.png"
                    onClick={() => {
                        setText("");
                        onChange("");
                        if (onClearText) {
                            onClearText();
                        }
                    }}/>
            </div>
            {children}
            <input
                ref={inputRef}
                type="text"
                value={text}
                className={"custom-input__input " +
                    (noBorder ? "custom-input__input_no-border" : "custom-input__input_with-border")}
                spellCheck="false"
                {...attrs}
                onChange={(e) => {
                    setText(e.target.value);
                    onChange(e.target.value);
                }}/>
            {icon &&
                <IconImage
                    className="custom-input__icon"
                    alt="Иконка"
                    src={icon}/>
            }
        </div>
    );
};

export default TextInput;