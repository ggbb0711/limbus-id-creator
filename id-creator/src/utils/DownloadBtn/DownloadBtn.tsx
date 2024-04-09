import React from "react";
import { ReactElement } from "react";
import "./DownloadBtn.css"

export default function DownloadBtn({clickHandler}:{clickHandler}):ReactElement{
    return <div className="download-btn" onClick={()=>clickHandler()}>
        <span className="material-symbols-outlined">
            download
        </span>
    </div>
}