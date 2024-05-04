import React, {useState} from 'react';
import "./Controls.sass";

const actions = {
    mailing: 0
}

const Controls = () => {
    const [selectedAction, setSelectedAction] = useState(-1);

    function handleCloseWindow(){
        setSelectedAction(-1);
    }

    return (
        <>
            <div className="controls">
                <button onClick={() => {
                    setSelectedAction(actions.mailing)
                }}>Рассылка
                </button>
            </div>
            {selectedAction === actions.mailing &&
                <ControlWindow onCloseWindow={handleCloseWindow} />
            }
        </>
    );
};

function ControlWindow({onCloseWindow}) {
    return (
        <div className="control-window mailing-window" onClick={onCloseWindow}>
            <div className="control-window__content">

            </div>
        </div>
    )
}

export default Controls;