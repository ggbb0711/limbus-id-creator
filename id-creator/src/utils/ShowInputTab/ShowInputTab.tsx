import React from "react";
import { ReactElement } from "react";
import "./ShowInputTab.css"

export default function ShowInputTab({isShown,clickHandler}:{isShown:boolean,clickHandler}):ReactElement{
    return <div className="show-input-tab-container" onClick={clickHandler}>
        <span className={`material-symbols-outlined ${isShown?"hidden":""}`}>
            keyboard_arrow_up
        </span>
        <span className={`material-symbols-outlined ${isShown?"":"hidden"}`}>
            keyboard_arrow_down
        </span>
    </div>
}