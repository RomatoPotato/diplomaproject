import React, {useEffect, useRef, useState} from 'react';
import "./NumberInput.css";
import TextInput from "../TextInput/TextInput";
import ImageButton from "../ImageButton/ImageButton";

const NumberInput = ({min, max, value, onChange, name, onClearText}) => {
    const [number, setNumber] = useState(value);
    const inFocus = useRef(false);
    const inputRef = useRef();

    useEffect(() => {
        setNumber(value);
    }, [value]);

    useEffect(() => {
        const disableScroll = (e) => {
            if (inFocus.current && inputRef.current === e.target) {
                e.preventDefault();
            }
        }

        window.addEventListener("wheel", disableScroll, {passive: false});

        return () => {
            window.removeEventListener("wheel", disableScroll);
        }
    }, [inFocus]);

    function addValue(value) {
        let currentValue = number;

        if (!currentValue || currentValue === "") {
            currentValue = 0;

            if (currentValue < min) currentValue = min;
            if (currentValue > max) currentValue = max;

            setNumber(currentValue);

            if (onChange) {
                onChange(currentValue);
            }
            return;
        }

        if ((min && currentValue + value < min) || (max && currentValue + value > max)) {
            value = 0;
        }

        setNumber(currentValue + value);
        if (onChange) {
            onChange(currentValue + value);
        }
    }

    return (
        <TextInput
            ref={inputRef}
            name={name}
            icon="../static/images/course.png"
            className="input-number"
            value={number}
            onChange={(value) => {
                const parsedToInt = parseInt(value.replace(/\D/gm, "").replace(/^0+/, "0").replace(/^0(.+)/, "$1"))

                setNumber(isNaN(parsedToInt) ? "" : parsedToInt);

                if (onChange) {
                    onChange(value);
                }
            }}
            onClearText={() => {
                setNumber("");
            }}
            onWheel={(e) => {
                if (e.target === document.activeElement) {
                    inFocus.current = true;
                    if (e.deltaY > 0) addValue(-1);
                    if (e.deltaY < 0) addValue(1);
                } else {
                    inFocus.current = false;
                }
            }}>
            <div className="input-number__buttons-box">
                <ImageButton
                    src={"../static/images/arrow-up.png"}
                    className="input-number__arrow"
                    onClick={() => {
                        addValue(1);
                    }}/>
                <ImageButton
                    src={"../static/images/arrow-down.png"}
                    className="input-number__arrow"
                    onClick={() => {
                        addValue(-1);
                    }}/>
            </div>
        </TextInput>
    );
};

export default NumberInput;