import React from "react";
import { ReactElement } from "react";
import "./ChangeModeBtn.css"

export default function ChangeModeBtn({mode,setMode}:{mode:string,setMode}):ReactElement{
    return <div className="change-mode-btn" onClick={setMode}>
        {mode==="IdInfo"?"EGO":"ID"}
    </div>
}