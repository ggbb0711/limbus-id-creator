import { ReactElement, useState } from "react";
import "./PopUpMenu.css"
import React from "react";
import Close_icon from "Icons/Close_icon";

export default function PopUpMenu({children,setIsActive}:{children:ReactElement,setIsActive:()=>void}):ReactElement{

    return <div className="popup-container">
        <div className="popup-background" onClick={setIsActive}></div>
        <div className="popup-outline">
            <div className="popup">
                <span className="close-popup" onClick={setIsActive}><Close_icon/></span>
                {children}
            </div>
        </div>
    </div>
}