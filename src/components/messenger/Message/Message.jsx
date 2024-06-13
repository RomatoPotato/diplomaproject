import "./Message.css";

import {ContextMenuTrigger} from "../../ui/ContextMenu/ContextMenu";
import Attachment from "../Attachment/Attachment";

let paragraphId = 0;

export default function Message(
    {
        message,
        messageDate,
        lastSender,
        contextMenuName,
        selectMode = {enabled: false},
        onOpenMediaClick
    }
) {
    let icon = message.sender.icon;

    if (!icon || icon === "") {
        icon = "static/images/user.png";
    }

    return (
        <>
            {lastSender?._id !== message.sender._id &&
                <div className={"sender" + (message.self ? " sender_self" : "")}>
                    <img src={icon} alt="" className="sender__icon"/>
                    <span className="sender__name">{message.sender.surname} {message.sender.name}</span>
                </div>
            }
            <MessageWrapper
                selectMode={selectMode}
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
                        name={contextMenuName}
                        className={"message__text" + (message.self ? " message__text_self" : "")}
                        notShowCondition={selectMode.enabled}
                        triggerData={{
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
                        {message.type === "attachment" &&
                            <AttachmentsBox
                                message={message}
                                isSelectModeEnabled={selectMode.enabled}
                                onMediaClick={onOpenMediaClick}/>
                        }
                        <div className={"message__info" + (message.self ? " message__info_self" : "")}>
                            <p className={"message__date" + (message.self ? " message__date_self" : "")}>
                                {new Date(message.datetime).toLocaleTimeString("ru-RU", {
                                    hour: "numeric",
                                    minute: "numeric"
                                })}
                            </p>
                            {message.edited &&
                                <p><i>изм.</i></p>
                            }
                        </div>
                    </ContextMenuTrigger>
                </div>
            </MessageWrapper>
        </>
    );
};

const MessageWrapper = ({selectMode, children, ...attrs}) => {
    return (
        selectMode.enabled ?
            <label {...attrs}>{children}</label> :
            <div {...attrs}>{children}</div>
    )
}

const AttachmentsBox = ({message, isSelectModeEnabled, onMediaClick}) => {
    const mediaAttachments = [];
    const otherAttachments = [];

    for (const attachment of message.attachments) {
        if (attachment.mimetype.startsWith("image") || attachment.mimetype.startsWith("video")) {
            mediaAttachments.push(attachment);
        } else {
            otherAttachments.push(attachment);
        }
    }

    return (
        <div className="attachments-box">
            {mediaAttachments.length > 0 &&
                <div className="attachments-box__media-content">
                    {mediaAttachments.map(attachment =>
                        <Attachment
                            key={attachment.path}
                            file={attachment}
                            onMediaClick={onMediaClick}/>
                    )}
                </div>
            }
            {otherAttachments.length > 0 &&
                <div className="attachments-box__non-media-content">
                    {otherAttachments.map(attachment =>
                        <Attachment
                            key={attachment.path}
                            file={attachment}
                            isSelectModeEnabled={isSelectModeEnabled}/>
                    )}
                </div>
            }
        </div>
    )
}