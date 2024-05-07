import React, {useState} from 'react';
import "./Controls.sass";
import MailingWindow from "../../windows/MailingWindow/MailingWindow";

const actions = {
    mailing: 0
}

const Controls = ({chats, currentUser, onSendMailingClick}) => {
    const [selectedAction, setSelectedAction] = useState(-1);

    function handleCloseWindow() {
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
                <MailingWindow
                    onCloseMailingWindow={handleCloseWindow}
                    chats={chats}
                    currentUser={currentUser}
                    onSendMailingClick={onSendMailingClick}/>
            }
        </>
    );
};

export default Controls;