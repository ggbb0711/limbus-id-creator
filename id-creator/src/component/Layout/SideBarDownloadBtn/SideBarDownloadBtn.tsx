import { useRefDownloadContext } from "component/context/ImgUrlContext";
import Download_icon from "Icons/Download_icon";
import React, { ReactElement, useState } from "react";
import DownloadImg from "utils/Functions/DownloadImg";
import MainButton from "utils/MainButton/MainButton";
import "./SideBarDownloadBtn.css"
import { useAlertContext } from "component/context/AlertContext";

export default function SideBarDownloadBtn():ReactElement{
    const {setImgUrlState} = useRefDownloadContext()
    const [isLoading,setIsLoading] = useState(false)
    const {addAlert} = useAlertContext()

    
    const downloadImg = ()=>{
        setIsLoading(true)
        setImgUrlState()
            .then((imgUrl:string)=>{
                addAlert("Success","Download successful")
                DownloadImg(imgUrl,"Custom")
            })
            .catch((err)=>{
                console.log(err)
                addAlert("Failure","Error: Cannot download")
            })
            .finally(()=>setIsLoading(false))
    }
    
    return <>
        {isLoading?
        <MainButton component={<>
            <Download_icon/>
            <p>Downloading...</p>
        </>} btnClass={"main-button active center-element side-bar-download-btn"}/>:
        <MainButton component={<>
            <Download_icon/>
            <p>Download</p>
        </>} btnClass={"main-button center-element side-bar-download-btn"} clickHandler={downloadImg}/>}
    </>
}