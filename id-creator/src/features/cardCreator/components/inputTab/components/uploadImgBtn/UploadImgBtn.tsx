import React from "react";
import { ReactElement } from "react";
import "./UploadImgBtn.css"
import UploadFileIcon from "assets/icons/UploadFileIcon";
import useAlert from "hooks/useAlert";

export default function UploadImgBtn({onFileInputChange, name, id,btnTxt,btnClass,maxSize}:{onFileInputChange:(e:React.ChangeEvent<HTMLInputElement>)=>void, name: string, id: string,btnTxt:string|ReactElement,btnClass?:string,maxSize:number}):ReactElement{
    const {addAlert} = useAlert()
    
    return(
        <button className={`upload-img-btn main-button fill-button-component ${btnClass ?? ""}`}>
            <input className="upload-file-input" type="file" name={name} id={id} accept="image/png, image/jpeg" onChange={(e)=>{
                    const file = e.target.files?.[0]
                    if(!file) return
                    if(file.size>maxSize){
                        addAlert("Failure","That file is larger than the input limit")
                        return
                    }
                    onFileInputChange(e)
                }} onClick={(e)=>{e.currentTarget.value = ""}}/>
            <span>
                <UploadFileIcon />
            </span>
            <p>{btnTxt}</p>
        </button> 
    )
}