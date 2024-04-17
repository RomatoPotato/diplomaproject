import React from 'react';
import "./Header.css";

import user_icon from "../../../images/user.png";
import group_icon from "../../../images/group.png";

const Header = ({selectedChat, onCloseButtonClick}) => {
    let icon = selectedChat.icon;

    if (!icon || icon === ""){
        icon = selectedChat.isGroup ? group_icon : user_icon;
    }

    return (
        <div className="chat-header">
            <div className="chat-header__info">
                <img className="chat-header__icon" alt="" src={icon}/>
                <span className="chat-header__name">{
                    selectedChat.chatName
                }</span>
            </div>
            <button onClick={onCloseButtonClick}>Закрыть</button>
        </div>
    );
};

export default Header;