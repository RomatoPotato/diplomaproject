import React, {useEffect, useState} from 'react';
import "./BetterSelect.css";
import TextInput from "../TextInput/TextInput";
import ImageButton from "../ImageButton/ImageButton";

const BetterSelect = ({onChange, className, elements, defaultElement}) => {
    const [isOpened, setIsOpened] = useState(false);
    const [selectedElement, setSelectedElement] = useState(defaultElement);

    const [filterText, setFilterText] = useState("");

    function filter(element) {
        return element.text.toLowerCase().includes(filterText.toLowerCase());
    }

    useEffect(() => {
        const closeSelectBox = () => setIsOpened(false);

        window.addEventListener("click", closeSelectBox);
        return () => window.removeEventListener("click", closeSelectBox);
    }, []);

    function handleSelect(element) {
        setSelectedElement(element);
        setIsOpened(false);
        onChange(element.value);
    }

    return (
        <div
            className={"better-select " + (className || "") + (isOpened ? " better-select_focused" : "")}
            onClick={(e) => e.stopPropagation()}>
            <div
                className="better-select__selected-box"
                onClick={() => {
                    if (!isOpened) {
                        setIsOpened(true);
                    }
                }}>
                {isOpened ?
                    <TextInput
                        autoFocus
                        className="better-select__search-input"
                        noBorder={true}
                        value={filterText}
                        onChange={(value) => {
                            setFilterText(value);
                        }}
                        onClearText={() => setFilterText("")}
                        icon="static/images/search.png"/> :
                    <input
                        className="better-select__selected-text"
                        value={selectedElement.text}
                        readOnly/>
                }
                <div>
                    <ImageButton
                        className="better-select__button-open"
                        src="static/images/select-arrow.png"
                        onClick={() => {
                            setIsOpened(!isOpened);
                        }}/>
                </div>
            </div>
            {isOpened &&
                <div className="better-select__options-box">
                    {[defaultElement].concat(elements).filter(filter).length === 0 && <p>Ничего не найдено</p>}
                    {[defaultElement].concat(elements).filter(filter).map(element =>
                        <BetterOption
                            selected={selectedElement.value === element.value}
                            key={element.value}
                            value={element.value}
                            onSelect={handleSelect}>
                            {element.text}
                        </BetterOption>
                    )}
                </div>
            }
        </div>
    );
};

const BetterOption = ({value, onSelect, selected, children}) => {
    return (
        <div
            className={"better-option " + (selected ? "better-option_selected" : "")}
            onClick={() => {
                if (onSelect) {
                    onSelect({value, text: children})
                }
            }}>
            {children}
        </div>
    );
};

export default BetterSelect;