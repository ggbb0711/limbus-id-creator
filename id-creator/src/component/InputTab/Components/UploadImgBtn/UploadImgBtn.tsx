import React from "react";
import { ReactElement } from "react";
import "./UploadImgBtn.css"
import Upload_file_icon from "Icons/Upload_file_icon";

export default function UploadImgBtn({onFileInputChange}:{onFileInputChange:(e:React.ChangeEvent<HTMLInputElement>)=>void}):ReactElement{
    return(
        <button className="upload-img-btn">
            <input className="upload-file-input" type="file" name="splashArt" accept="image/png, image/gif, image/jpeg" onChange={onFileInputChange}/>
            <span>
                <Upload_file_icon/>
            </span>
        </button>
    )
}