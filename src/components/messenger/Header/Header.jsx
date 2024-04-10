import React from 'react';
import "./Header.css";

const Header = ({currentUser, selectedUser}) => {
    return (
        <div className="chat-header">
            {selectedUser ?
                <>
                    <h2>Чат <span className="chat-header__username">{currentUser?.name} {currentUser?.surname}&nbsp;</span></h2>
                    <img className="chat-header__icon" alt="" src={currentUser?.icon}/>
                    <h2>&nbsp;с <span className="chat-header__username">{selectedUser.name} {selectedUser.surname}</span></h2>
                    <img className="chat-header__icon" alt="" src={selectedUser.icon}/>
                </> :
                <>
                    <h2>Выберите чат, <span className="chat-header__username">{currentUser?.name} {currentUser?.surname}</span></h2>
                    <img className="chat-header__icon" alt="" src={currentUser?.icon}/>
                </>
            }
        </div>
    );
};

export default Header;