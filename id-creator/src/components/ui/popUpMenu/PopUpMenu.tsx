import { ReactElement } from "react";
import "./PopUpMenu.css"
import React from "react";
import CloseIcon from "assets/icons/CloseIcon";

export default function PopUpMenu({children,setIsActive}:{children:ReactElement,setIsActive:()=>void}):ReactElement{

    return <div className="popup-container">
        <div className="popup-background" onClick={setIsActive}></div>
        <div className="popup-outline">
            <div className="popup">
                <span className="close-popup" onClick={setIsActive}><CloseIcon/></span>
                {children}
            </div>
        </div>
    </div>
}