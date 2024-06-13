import React, {memo} from 'react';
import "./UploadFilesPlane.css";
import ImageButton from "../../ui/ImageButton/ImageButton";
import FilesManager from "../../../utils/FilesManager";

let nextFileId = 2024;

const UploadFilesPlane = memo(({files, onRemoveFileClick}) => {
    return (
        <div className="upload-files-plane">
            {files.length > 0 &&
                <div
                    className="upload-files-plane__wrapper"
                    onWheel={(e) => {
                        e.currentTarget.scrollBy(e.deltaY / 2, 0);
                    }}>
                    {files.map(file =>
                        <SelectedFile key={nextFileId++} file={file} onRemoveButtonClick={onRemoveFileClick}/>
                    )}
                </div>
            }
        </div>
    );
});

const SelectedFile = ({file, onRemoveButtonClick}) => {
    let fileType;
    let source = null;

    if (file.type.startsWith("image")) {
        fileType = "image";
    } else if (file.type.startsWith("video")) {
        fileType = "video";
    } else {
        fileType = "other";
    }

    if (fileType === "image" || fileType === "video"){
        source = URL.createObjectURL(file);
        URL.revokeObjectURL(file);
    }

    return (
        <div className="selected-file">
            {(fileType === "image" || fileType === "video") ?
                fileType === "video" ?
                    <video
                        className="selected-file__video"
                        disablePictureInPicture
                        disableRemotePlayback
                        muted>
                        <source src={source}/>
                    </video> :
                    <div
                        className="selected-file__image"
                        style={{backgroundImage: `url(${source})`}}>
                    </div> :
                <div className="selected-file__other">
                    <div className="selected-file__other-icon" />
                    <div className="selected-file__info">
                        <b><p>{file.name}</p></b>
                        <p>{FilesManager.getFileSize(file.size)}</p>
                    </div>
                </div>
            }
            <div className="selected-file__actions-box">
                <ImageButton
                    className="selected-file__action-button" src="../static/images/delete.png"
                    onClick={() => onRemoveButtonClick(file)}/>
            </div>
        </div>
    )
}

export default UploadFilesPlane;