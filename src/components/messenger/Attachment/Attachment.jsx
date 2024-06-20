import React from 'react';
import "./Attachment.css";
import IconImage from "../../ui/IconImage/IconImage";
import FilesManager from "../../../utils/FilesManager";

const Attachment = ({file, onMediaClick, isSelectModeEnabled = false}) => {
    if (file.mimetype.startsWith("image") || file.mimetype.startsWith("video")) {
        file.type = "media";
    } else {
        file.type = "other";
    }

    function downloadFile(file) {
        if (!isSelectModeEnabled) {
            const element = document.createElement("a");
            element.href = file.path;
            element.download = file.name;
            element.click();
            URL.revokeObjectURL(element.href);
        }
    }

    return (
        <div
            onClick={file.type === "media" ? () => onMediaClick(file) : () => downloadFile(file)}
            className={"attachment " + (!isSelectModeEnabled ? "attachment_select-mode" : "")}>
            {file.type === "media" && (
                file.mimetype.startsWith("video") ?
                    <div className="attachment__video-thumbnail">
                        <video
                            disablePictureInPicture
                            disableRemotePlayback
                            muted>
                            <source src={file.path}/>
                        </video>
                        <div className="button-play">
                            <IconImage src="static/images/play.png" className="button-play__icon"/>
                        </div>
                    </div> :
                    <div
                        className="attachment__image-thumbnail"
                        style={{backgroundImage: `url('${file.path}')`}}>
                    </div>
            )}
            {file.type === "other" &&
                <div className="attachment__file-thumbnail"></div>
            }
            {file.type !== "media" &&
                <div className="attachment__info">
                    <b><p>{file.name}</p></b>
                    <p>{FilesManager.getFileSize(file.size)}</p>
                </div>
            }
        </div>
    );
};

export default Attachment;