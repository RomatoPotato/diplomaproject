import "./Message.css"

export default function Message({ sender, text, date, self }) {
    return (
        <div className={"message" + (self ? " self" : "")}>
            <div className={"message__info" + (self ? " self" : "")}>
                <img src={sender.icon} alt="" className="message__user-icon"/>
                <span className="message__user-name">{sender.name}</span>
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