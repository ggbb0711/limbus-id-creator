import React from "react";
import { ReactElement } from "react";
import "./UploadImgBtn.css"
import Upload_file_icon from "Icons/Upload_file_icon";
import MainButton from "utils/MainButton/MainButton";

export default function UploadImgBtn({onFileInputChange,btnTxt,btnClass}:{onFileInputChange:(e:React.ChangeEvent<HTMLInputElement>)=>void,btnTxt:string|ReactElement,btnClass?:string}):ReactElement{
    return(
        <MainButton component={<>
            <input className="upload-file-input" type="file" name="splashArt" accept="image/png, image/gif, image/jpeg" onChange={onFileInputChange} />
            <span>
                <Upload_file_icon />
            </span>
            <p>{btnTxt}</p>
        </>} btnClass={"upload-img-btn main-button fill-button-component "+btnClass}/>
    )
}