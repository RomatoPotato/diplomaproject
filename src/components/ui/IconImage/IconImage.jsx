import React from 'react';
import "./IconImage.css";

const IconImage = ({className, src}) => {
    return (
        <div className="icon-image">
            <div className={className} style={{
                maskImage: "url(" + src + ")"
            }}></div>
        </div>
    );
};

export default IconImage;