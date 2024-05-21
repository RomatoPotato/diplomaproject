import React from 'react';
import "./ImageButton.css";

const ImageButton = ({src, className, children, ...attrs}) => {
    return (
        <div className={"image-button " + (className || "")}>
            <button {...attrs} style={{
                maskImage: "url(" + src + ")"
            }}>{children}</button>
        </div>
    );
};

export default ImageButton;