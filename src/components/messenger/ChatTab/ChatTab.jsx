import "./ChatTab.css"

export default function ChatTab({chat, showGroup, onChatTabClick, selected}) {
    let icon;

    if (chat.type === "dialog") {
        icon = chat.interlocutor.icon;
    } else {
        icon = chat.icon;
    }

    if (!icon || icon === "") {
        icon = chat.type === "dialog" ? "static/images/user.png" : "static/images/group.png";
    }

    return (
        <div className={"chat-tab " + (selected ? "chat-tab_selected" : "")} onClick={onChatTabClick}>
            <div className="chat-tab__content">
                <div className="chat-tab__icon-box">
                    {chat.type === "dialog" &&
                        <div className={"chat-tab__status " +
                            (chat.interlocutor.online ? "chat-tab__status_online" : "chat-tab__status_offline")}>
                        </div>
                    }
                    <img className="chat-tab__icon" src={icon} alt=""/>
                </div>
                <div className="chat-tab__desc">
                    <p className="chat-tab__title">{chat.name}</p>
                    {chat.type !== "dialog" && showGroup &&
                        <p className="chat-tab__group-name">
                            {chat.type === "mainGroup" ?
                                "Главная группа" :
                                chat.group.name
                            }
                        </p>
                    }
                    <div className="chat-tab__message-info">
                        {chat.lastMessage &&
                            <p className="chat-tab__last-msg"><b>{chat.lastMessage.sender.name}: </b>{chat.lastMessage.text}</p>
                        }
                        {chat.hasNewMessages &&
                            <div className="chat-tab__new-message-info">
                                <div className="chat-tab__message-icon"></div>
                                <p className="chat-tab__new-message-number">+1</p>
                            </div>
                        }
                    </div>
                </div>
            </div>
            <div className="chat-tab__delimiter"></div>
        </div>
    )
};