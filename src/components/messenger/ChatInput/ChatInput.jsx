import "./ChatInput.css"

import attach_icon from "../../../images/attach-file.png"
import send_icon from "../../../images/send.png"
import {useRef, useState} from "react";

const maxLinesNumber = 10;

export default function ChatInput({onMessageSubmit}) {
    const [message, setMessage] = useState("");
    const textAreaRef = useRef();

    function handleSubmitMessage(){
        if (message.trim().length > 0) {
            onMessageSubmit(message);
            setMessage("");
            textAreaRef.current.rows = 1;
        }
    }

    return (
        <div className="chat-input">
            <div className="chat-input__input-field">
                <div className="input-field-wrapper">
                    <textarea
                        rows={1}
                        ref={textAreaRef}
                        autoFocus
                        spellCheck="false"
                        value={message}
                        onChange={(e) => {
                            e.target.rows = 1;
                            e.target.rows = Math.min(e.target.scrollHeight / parseInt(getComputedStyle(e.target).lineHeight), maxLinesNumber);
                            setMessage(e.target.value);
                        }}
                        onKeyDown={(e) => {
                            if (e.shiftKey && e.key === "Enter") {
                                e.preventDefault();
                                handleSubmitMessage();
                            }
                        }}/>
                </div>
            </div>
            <label className="chat-input__file-button">
                <input type="file"/>
                <img src={attach_icon} alt="Прикрепить файл"/>
            </label>
            <label className="chat-input__send-button">
                <input type="submit"/>
                <img src={send_icon} alt="Отправить" onClick={handleSubmitMessage}/>
            </label>
        </div>
    )
};