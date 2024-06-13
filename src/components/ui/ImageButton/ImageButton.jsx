import React from 'react';
import "./ImageButton.css";

const ImageButton = ({src, className, type, children, ...attrs}) => {
    return (
        <div className={"image-button " + (className || "")}>
            <button tabIndex={-1} type={type ? type : "button"} {...attrs} style={{
                maskImage: "url(" + src + ")"
            }}>{children}</button>
        </div>
    );
};

export default ImageButton;