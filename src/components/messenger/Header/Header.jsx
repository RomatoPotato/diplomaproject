import React from 'react';
import "./Header.css";

import CloseButton from "../../ui/CloseButton/CloseButton";

const Header = ({selectedChat, onCloseButtonClick, onChatInfoClick}) => {
    let icon = selectedChat.icon;

    if (!icon || icon === "") {
        icon = selectedChat.type === "dialog" ? "static/images/user.png" : "static/images/group.png";
    }

    return (
        <div className="chat-header">
            <div className="chat-header__info">
                <img className="chat-header__icon" alt="" src={icon} onClick={onChatInfoClick}/>
                <span className="chat-header__name">{selectedChat.name}</span>
            </div>
            <CloseButton className="chat-header__button-close" onCloseButtonClick={onCloseButtonClick} />
        </div>
    );
};

export default Header;