import React from 'react';
import "./Controls.sass";
import ImageButton from "../../ui/ImageButton/ImageButton";
import {show} from "../../../utils/GlobalEventListeners/ShowModalsEventListener";

const Controls = () => {
    return (
        <>
            <div className="controls">
                <ImageButton
                    className="controls__button"
                    src="static/images/mailing.png"
                    onClick={() => {
                        show("Создание рассылки");
                    }}/>
            </div>
        </>
    );
};

export default Controls;