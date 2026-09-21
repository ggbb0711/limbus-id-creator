import React from "react";
import PopUpMenu from "Components/PopUpMenu/PopUpMenu";
import "./ResetMenu.css"
import CheckIcon from "Assets/Icons/CheckIcon";
import CloseIcon from "Assets/Icons/CloseIcon";

export default function ResetMenu({isActive,setIsActive,confirmFn}:{isActive:boolean,setIsActive:(isActive:boolean)=>void,confirmFn:()=>void}){
    return <div className={`${isActive?"":"hidden"}`}>
        <PopUpMenu setIsActive={()=>setIsActive(!isActive)}>
            <div className="reset-menu">
                <h1>Do you want to reset your progess</h1>
                <div className="center-element">
                    <button className="main-button center-element" onClick={()=>{
                            confirmFn()
                            setIsActive(!isActive)
                        }}>
                        <CheckIcon/>
                        <p>Confirm</p>
                    </button>
                    <button className="main-button center-element" onClick={()=>setIsActive(!isActive)}>
                        <CloseIcon/>
                        <p>Cancel</p>
                    </button>
                </div>
            </div>
        </PopUpMenu>
    </div>
}