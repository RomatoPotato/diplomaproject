import "./Message.css";

import user_icon from "../../../images/user.png";
import {ContextMenuTrigger} from "../../ui/ContextMenu/ContextMenu";

let paragraphId = 0;

export default function Message({message, messageDate, lastSender, self}) {
    let icon = message.sender.icon;

    if (!icon || icon === "") {
        icon = user_icon;
    }

    return (
        <div
            className={"message" + (self ? " message_self" : "")}>
            <div className={"message__sender" + (self ? " message__sender_self" : "")}>
                {lastSender?._id !== message.sender._id &&
                    <>
                        <img src={icon} alt="" className="message__sender-icon"/>
                        <span className="message__sender-name">{message.sender.surname} {message.sender.name}</span>
                    </>
                }
            </div>
            <ContextMenuTrigger
                className={"message__text" + (self ? " message__text_self" : "")}
                data={{
                    message,
                    date: messageDate,
                    hideData: {
                        name: "self",
                        value: self
                    }
                }}>
                <div>
                    {message.text.split("\n").map(text =>
                        <p key={paragraphId++}>{text}</p>
                    )}
                </div>
                <div className={"message__info" + (self ? " message__info_self" : "")}>
                    <p className={"message__date" + (self ? " message__date_self" : "")}>
                        {
                            new Date(message.datetime).toLocaleTimeString("ru-RU", {
                                hour: "numeric",
                                minute: "numeric"
                            })
                        }
                    </p>
                    {message.edited &&
                        <p><i>изм.</i></p>
                    }
                </div>
            </ContextMenuTrigger>
        </div>
    )
};