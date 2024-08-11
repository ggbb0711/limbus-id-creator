import React from "react";
import { ReactElement } from "react";
import "./ShowInputTab.css"
import Arrow_down_icon from "Icons/Arrow_down_icon";
import Arrow_up_icon from "Icons/Arrow_up_icon";

export default function ShowInputTab({isShown,clickHandler}:{isShown:boolean,clickHandler}):ReactElement{
    return <div className="show-input-tab-container" onClick={clickHandler}>
        <span className={`${isShown?"hidden":""}`}>
            <Arrow_up_icon/>
        </span>
        <span className={`${isShown?"":"hidden"}`}>
            <Arrow_down_icon/>
        </span>
    </div>
}