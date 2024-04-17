import "./Message.css";

import user_icon from "../../../images/user.png";

export default function Message({ sender, text, date, self }) {
    let icon = sender.icon;

    if (!icon || icon === ""){
        icon = user_icon;
    }

    return (
        <div className={"message" + (self ? " self" : "")}>
            <div className={"message__info" + (self ? " self" : "")}>
                <img src={icon} alt="" className="message__user-icon"/>
                <span className="message__user-name">{sender?.name}</span>
            </div>
            <p className="message__text">{text}</p>
            <p className={"message__date" + (self ? " self" : "")}>
                {
                    new Date(date).toLocaleDateString("ru-RU")
                    + " "
                    + new Date(date).toLocaleTimeString("ru-RU")
                }
            </p>
        </div>
    )
};