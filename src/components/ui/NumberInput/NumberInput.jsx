import React, {useEffect, useState} from 'react';
import "./NumberInput.css";
import TextInput from "../TextInput/TextInput";
import ImageButton from "../ImageButton/ImageButton";

const NumberInput = ({min, max, value, onChange, onClearText}) => {
    const [number, setNumber] = useState(value);

    function addValue(value) {
        let currentValue = number;

        if (!currentValue || currentValue === ""){
            currentValue = 0;

            if (currentValue < min) currentValue = min;
            if (currentValue > max) currentValue = max;

            setNumber(currentValue);
            onChange(currentValue)
            return;
        }

        if ((min && currentValue + value < min) || (max && currentValue + value > max)){
            value = 0;
        }

        setNumber(currentValue + value);
        onChange(currentValue + value);
    }

    return (
        <TextInput
            icon="static/images/course.png"
            className="input-number"
            value={number}
            onChange={(value) => {
                const parsedToInt = parseInt(value.replace(/\D/gm, "").replace(/^0+/, "0").replace(/^0(.+)/, "$1"))

                setNumber(isNaN(parsedToInt) ? "" : parsedToInt);
                onChange(value);
            }}
            onClearText={() => {
                setNumber("");
            }}
            onWheel={(e) => {
                if (e.target === document.activeElement) {
                    if (e.deltaY > 0) addValue(-1);
                    if (e.deltaY < 0) addValue(1);
                }
            }}>
            <div className="input-number__buttons-box">
                <ImageButton
                    src={"static/images/arrow-up.png"}
                    className="input-number__arrow"
                    onClick={() => {
                        addValue(1);
                    }}/>
                <ImageButton
                    src={"static/images/arrow-down.png"}
                    className="input-number__arrow"
                    onClick={() => {
                        addValue(-1);
                    }} />
            </div>
        </TextInput>
    );
};

export default NumberInput;