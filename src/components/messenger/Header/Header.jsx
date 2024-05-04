import React from 'react';
import "./Header.css";

import user_icon from "../../../images/user.png";
import group_icon from "../../../images/group.png";

const Header = ({selectedChat, onCloseButtonClick, onChatInfoClick}) => {
    let icon = selectedChat.icon;

    if (!icon || icon === "") {
        icon = selectedChat.type === "dialog" ? user_icon : group_icon;
    }

    return (
        <div className="chat-header">
            <div className="chat-header__info">
                <img className="chat-header__icon" alt="" src={icon} onClick={onChatInfoClick}/>
                <span className="chat-header__name">{selectedChat.name}</span>
            </div>
            <button onClick={onCloseButtonClick}>Закрыть</button>
        </div>
    );
};

export default Header;