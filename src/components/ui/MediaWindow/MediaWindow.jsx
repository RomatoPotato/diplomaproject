import React, {useRef, useState} from 'react';
import "./MediaWindow.css";
import listener from "../../../utils/GlobalEventListeners/ShowModalsEventListener";

const MediaWindow = () => {
    const [isShown, setIsShown] = useState(false);
    const [file, setFile] = useState(null);
    const mediaWindowContentRef = useRef();

    const open = (e) => {
        setFile(e.detail.data);
        setIsShown(true);
    }

    const close = () => {
        if (isShown) {
            setIsShown(false);
            setFile(null);
        }
    }

    const closeOnOutsideClick = (e) => {
        if (!mediaWindowContentRef.current.contains(e.target)) {
            close();
        }
    }

    listener.register("media-window", open, close);

    return (
        <div className="media-window">
            <div
                className="media-window__backdrop"
                style={{
                    opacity: isShown ? 1 : 0,
                    pointerEvents: isShown ? "all" : "none",
                }}
                onClick={file?.mimetype.startsWith("image") ? close : closeOnOutsideClick}>
                {file?.mimetype.startsWith("image") &&
                    <img
                        className="media-window__content"
                        ref={mediaWindowContentRef}
                        alt="Открытое изображение"
                        src={file.path}/>
                }
                {file?.mimetype.startsWith("video") &&
                    <video
                        className="media-window__content"
                        controls
                        disablePictureInPicture
                        ref={mediaWindowContentRef}>
                        <source src={file.path}/>
                    </video>
                }
            </div>
        </div>
    );
};

export default MediaWindow;