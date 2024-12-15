import React from "react";
import { ReactElement } from "react";
import "./UploadImgBtn.css"
import Upload_file_icon from "Icons/Upload_file_icon";
import MainButton from "utils/MainButton/MainButton";
import { useAlertContext } from "component/context/AlertContext";

export default function UploadImgBtn({onFileInputChange,btnTxt,btnClass,maxSize}:{onFileInputChange:(e:React.ChangeEvent<HTMLInputElement>)=>void,btnTxt:string|ReactElement,btnClass?:string,maxSize?:number}):ReactElement{
    const {addAlert} = useAlertContext()
    
    return(
        <MainButton component={<>
            <input className="upload-file-input" type="file" name="splashArt" accept="image/png, image/jpeg" onChange={(e)=>{
                    if(e.target.files[0].size<=maxSize) onFileInputChange(e)
                    else addAlert("Failure","That file is larger than the input limit")
                }} onClick={(e)=>{e.currentTarget.value = ""}}/>
            <span>
                <Upload_file_icon />
            </span>
            <p>{btnTxt}</p>
        </>} btnClass={"upload-img-btn main-button fill-button-component "+btnClass}/>
    )
}