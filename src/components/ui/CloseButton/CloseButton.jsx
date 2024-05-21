import React from 'react';
import ImageButton from "../ImageButton/ImageButton";

const CloseButton = ({onCloseButtonClick, className}) => {
    return (
        <ImageButton
            src="static/images/close.png"
            className={"button-close " + (className ? className : "")}
            onClick={onCloseButtonClick} />
    );
};

export default CloseButton;