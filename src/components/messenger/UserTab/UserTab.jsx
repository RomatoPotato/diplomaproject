import "./UserTab.css"

export default function UserTab({user, onChatTabClick}) {
    return (
        <div className="chat-tab" onClick={onChatTabClick}>
            <img className="chat-tab__icon" src={user.icon}  alt=""/>
            <div className="chat-tab__desc">
                <p className="chat-tab__title">{user.name} {user.surname}</p>
                <p className="chat-tab__last-msg">{user.messages.length > 0 && user.messages[user.messages.length - 1].text}</p>
            </div>
            <div className="chat-tab__notify-block">
                <svg className="notify-sent">
                    <circle cx="5" cy="5" r="5" fill={user.connected ? "green" : "red"} />
                </svg>
                <svg className="notify-received">
                    { user.hasNewMessages && <circle cx="5" cy="5" r="5" fill="blue" />}
                </svg>
            </div>
        </div>
    )
};