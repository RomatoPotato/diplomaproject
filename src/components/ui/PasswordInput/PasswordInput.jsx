import React, {useState} from 'react';
import "./PasswordInput.css";
import TextInput from "../TextInput/TextInput";
import ImageButton from "../ImageButton/ImageButton";

const PasswordInput = ({name, placeholder, errorData, ...attrs}) => {
    const [isShown, setIsShown] = useState(false);

    return (
        <TextInput
            minLength={8}
            required={true}
            type={isShown ? "text" : "password"}
            icon={"../static/images/gen_psw_icon.png"}
            name={name}
            placeholder={placeholder}
            errorData={errorData}
            {...attrs}>
            <div>
                <ImageButton
                    className="button-toggle-visibility"
                    src={isShown ? "../static/images/hide.png" : "../static/images/show.png"}
                    onClick={() => {
                        setIsShown(!isShown);
                    }}/>
            </div>
        </TextInput>
    );
};

export default PasswordInput;