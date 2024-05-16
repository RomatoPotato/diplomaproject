import "./Message.css";

import user_icon from "../../../images/user.png";
import {ContextMenuTrigger} from "../../ui/ContextMenu/ContextMenu";

let paragraphId = 0;

export default function Message({message, messageDate, lastSender, selectMode}) {
    let icon = message.sender.icon;

    if (!icon || icon === "") {
        icon = user_icon;
    }

    return (
        <>
            {lastSender?._id !== message.sender._id &&
                <div className={"sender" + (message.self ? " sender_self" : "")}>
                    <img src={icon} alt="" className="sender-icon"/>
                    <span
                        className="sender-name">{message.sender.surname} {message.sender.name}</span>
                </div>
            }
            <label
                className={"message" + (message.self ? " message_self" : "") + (selectMode.enabled ? " message_select-mode" : "")}>
                {selectMode.enabled &&
                    <input
                        type="checkbox"
                        checked={selectMode.messagesData.filter(msgData => msgData.message._id === message._id).length !== 0}
                        onChange={(e) => {
                            const event = new CustomEvent("select_message", {
                                detail: {
                                    messageData: {
                                        message,
                                        date: messageDate
                                    },
                                    selected: e.target.checked
                                }
                            });
                            window.dispatchEvent(event);
                        }}/>
                }
                <div className={"message__wrapper" + (message.self ? " message__wrapper_self" : "")}>
                    <ContextMenuTrigger
                        className={"message__text" + (message.self ? " message__text_self" : "")}
                        notShowCondition={selectMode.enabled}
                        data={{
                            message,
                            date: messageDate,
                            hideData: {
                                name: "self",
                                value: message.self
                            }
                        }}>
                        <div>
                            {message.text.split("\n").map(text =>
                                <p key={paragraphId++}>{text}</p>
                            )}
                        </div>
                        <div className={"message__info" + (message.self ? " message__info_self" : "")}>
                            <p className={"message__date" + (message.self ? " message__date_self" : "")}>
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
            </label>
        </>
    );
};