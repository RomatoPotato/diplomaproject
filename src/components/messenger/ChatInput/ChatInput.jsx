import "./ChatInput.css"
import React, {useEffect, useRef, useState} from "react";
import ImageButton from "../../ui/ImageButton/ImageButton";

const maxLinesNumber = 10;

export default function ChatInput({onSelectFilesClick, onSelectFilesChange, onMessageSubmit, text}) {
    const [message, setMessage] = useState(text);
    const textAreaRef = useRef();

    function handleSubmitMessage() {
        onMessageSubmit(message);
        setMessage("");
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
            <div className="chat-input__wrapper">
                <div className="chat-input__input-wrapper">
                    <div className="chat-input__input-field">
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
                <div className="chat-input__buttons-box">
                    <ImageButton src="static/images/attach-file.png" className="chat-input__button file-button">
                        <label>
                            <input
                                type="file"
                                multiple
                                onClick={(e) => {
                                    onSelectFilesClick(e);
                                }}
                                onChange={(e) => {
                                    onSelectFilesChange(e);
                                }}/>
                        </label>
                    </ImageButton>
                    <ImageButton
                        src="static/images/send.png"
                        className="chat-input__button send-button"
                        onClick={handleSubmitMessage}>
                        <input type="submit"/>
                    </ImageButton>
                </div>
            </div>
        </div>
    )
};