import "./ChatInput.css"

import attach_icon from "../../../images/attach-file.png"
import send_icon from "../../../images/send.png"
import {useEffect, useRef, useState} from "react";

const maxLinesNumber = 10;

export default function ChatInput({onMessageSubmit, text}) {
    const [message, setMessage] = useState(text);
    const textAreaRef = useRef();

    function handleSubmitMessage(){
        if (message.trim().length > 0) {
            onMessageSubmit(message.replace(/\s{2,}/g, " ").trim()); // to remove redundant spaces
            setMessage("");
        }
    }

    useEffect(() => {
        textAreaRef.current.rows = 1;
        textAreaRef.current.rows = Math.min(textAreaRef.current.scrollHeight / parseInt(getComputedStyle(textAreaRef.current).lineHeight), maxLinesNumber);
    }, [message]);

    useEffect(() => {
        setMessage(text);
        textAreaRef.current.focus();
    }, [text]);

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
                            setMessage(e.target.value);
                        }}
                        onKeyDown={(e) => {
                            if (e.shiftKey && e.key === "Enter") {
                                return;
                            }

                            if (e.key === "Enter") {
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