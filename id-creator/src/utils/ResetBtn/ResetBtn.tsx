import React from "react";
import { ReactElement } from "react";
import "./ResetBtn.css"
import Reset_icon from "Icons/Reset_icon";

export default function ResetBtn({clickHandler}:{clickHandler:()=>void}):ReactElement{
    return <div className="reset-btn" onClick={clickHandler}>
        <Reset_icon/>
    </div>
}