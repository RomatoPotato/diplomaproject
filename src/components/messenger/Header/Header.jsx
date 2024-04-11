import React from 'react';
import "./Header.css";

import user_icon from "../../../images/user.png";

const Header = ({selectedContact, onCloseButtonClick}) => {
    let icon = selectedContact.icon;

    if (!icon || icon === ""){
        icon = user_icon;
    }

    return (
        <div className="chat-header">
            <div className="contact-info">
                <span className="chat-header__username">{selectedContact.name} {selectedContact.surname}</span>
                <img className="chat-header__icon" alt="" src={icon}/>
            </div>
            <button onClick={onCloseButtonClick}>Закрыть</button>
        </div>
    );
};

export default Header;