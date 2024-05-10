import "./ChatInput.css"

import attach_icon from "../../../images/attach-file.png"
import send_icon from "../../../images/send.png"
import {useState} from "react";
import {Form} from "react-router-dom";

const maxLinesNumber = 10;

export default function ChatInput({onMessageSubmit}) {
    const [message, setMessage] = useState("");

    return (
        <Form
            className="chat-input"
            onSubmit={(e) => {
                e.preventDefault();

                if (message.trim().length > 0) {
                    onMessageSubmit(message);
                    setMessage("");
                }
            }}>
            <textarea
                className="chat-input__textarea"
                spellCheck="false"
                value={message}
                onChange={(e) => {
                    e.target.style.height = "auto";
                    e.target.style.height = Math.min(e.target.scrollHeight, maxLinesNumber * parseInt(getComputedStyle(e.target).fontSize)) + "px";
                    setMessage(e.target.value);
                }}/>
            <label className="chat-input__file-button">
                <input type="file"/>
                <img src={attach_icon} alt="Прикрепить файл"/>
            </label>
            <label className="chat-input__send-button">
                <input type="submit"/>
                <img src={send_icon} alt="Отправить"/>
            </label>
        </Form>
    )
};