import "./Message.css";

import user_icon from "../../../images/user.png";
import {ContextMenuTrigger} from "../../ui/ContextMenu/ContextMenu";

export default function Message({message, messageDate, lastSender, self}) {
    let icon = message.sender.icon;

    if (!icon || icon === "") {
        icon = user_icon;
    }

    return (
        <ContextMenuTrigger
            className={"message" + (self ? " message_self" : "")}
            data={{
                date: messageDate,
                _id: message._id,
                chatId: message.chatId
            }}>
            <div className={"message__info" + (self ? " message__info_self" : "")}>
                {lastSender?._id !== message.sender._id &&
                    <>
                        <img src={icon} alt="" className="message__user-icon"/>
                        <span className="message__user-name">{message.sender.surname} {message.sender.name}</span>
                    </>
                }
            </div>
            <div className={"message__text" + (self ? " message__text_self" : "")}>
                <p>{message.text}</p>
                <p className={"message__date" + (self ? " message__date_self" : "")}>
                    {
                        new Date(message.datetime).toLocaleTimeString("ru-RU", {
                            hour: "numeric",
                            minute: "numeric"
                        })
                    }
                </p>
            </div>
        </ContextMenuTrigger>
    )
};