import React from "react";
import { ReactElement } from "react";
import "./DownloadBtn.css"
import Download_icon from "Icons/Download_icon";



export default function DownloadBtn({clickHandler}:{clickHandler}):ReactElement{
    return <div className="download-btn" onClick={()=>clickHandler()}>
            <Download_icon/>
    </div>
}