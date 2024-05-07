import "./ChatTab.css"
import chat_icon from "../../../images/group.png";
import user_icon from "../../../images/user.png";

export default function ChatTab({chat, onChatTabClick}) {
    let icon;

    if (chat.type === "dialog"){
        icon = chat.interlocutor.icon;
    }else{
        icon = chat.icon;
    }

    if (!icon || icon === ""){
        icon = chat.type === "dialog" ? user_icon : chat_icon;
    }

    return (
        <div className="chat-tab" onClick={onChatTabClick}>
            <img className="chat-tab__icon" src={icon}  alt=""/>
            <div className="chat-tab__desc">
                <p className="chat-tab__title">{chat.name}</p>
                {chat.type !== "dialog" &&
                    <p className="chat-tab__group_name">
                        {chat.type === "mainGroup" ?
                            "Главная группа" :
                            chat.group.name
                        }
                    </p>
                }
                <p className="chat-tab__last-msg">
                    {chat.lastMessage &&
                        <><b>{chat.lastMessage.sender.name}: </b>{chat.lastMessage.text}</>
                    }
                </p>
            </div>
            <div className="chat-tab__notify-block">
                <svg className="notify-sent">
                    {chat.type === "dialog" && <circle cx="5" cy="5" r="5" fill={chat.interlocutor.online ? "green" : "red"} />}
                </svg>
                <svg className="notify-received">
                    {chat.hasNewMessages && <circle cx="5" cy="5" r="5" fill="blue" />}
                </svg>
            </div>
        </div>
    )
};