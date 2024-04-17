import "./ChatTab.css"
import chat_icon from "../../../images/group.png";
import user_icon from "../../../images/user.png";

export default function ChatTab({chat, onChatTabClick}) {
    let icon;

    if (chat.isGroup){
        icon = chat.icon;
    }else{
        icon = chat.interlocutor.icon;
    }

    if (!icon || icon === ""){
        icon = chat.isGroup ? chat_icon : user_icon;
    }

    return (
        <div className="chat-tab" onClick={onChatTabClick}>
            <img className="chat-tab__icon" src={icon}  alt=""/>
            <div className="chat-tab__desc">
                <p className="chat-tab__title">{chat.chatName}</p>
                <p className="chat-tab__last-msg"><b>{chat.lastMessage.sender.name}:</b> {chat.lastMessage.text}</p>
            </div>
            <div className="chat-tab__notify-block">
                <svg className="notify-sent">
                    {!chat.isGroup && <circle cx="5" cy="5" r="5" fill={chat.interlocutor.online ? "green" : "red"} />}
                </svg>
                <svg className="notify-received">
                    {chat.hasNewMessages && <circle cx="5" cy="5" r="5" fill="blue" />}
                </svg>
            </div>
        </div>
    )
};