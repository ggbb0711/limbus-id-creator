import React from "react";
import PopUpMenu from "utils/PopUpMenu/PopUpMenu";
import "./ResetMenu.css"
import MainButton from "utils/MainButton/MainButton";
import Check_icon from "Icons/Check_icon";
import Close_icon from "Icons/Close_icon";

export default function ResetMenu({isActive,setIsActive,confirmFn}:{isActive:boolean,setIsActive:(isActive:boolean)=>void,confirmFn:()=>void}){
    return <div className={`${isActive?"":"hidden"}`}>
        <PopUpMenu setIsActive={()=>setIsActive(!isActive)}>
            <div className="reset-menu">
                <h1>Do you want to reset your progess</h1>
                <div className="center-element">
                    <MainButton component={<>
                        <Check_icon/>
                        <p>Confirm</p>
                    </>} btnClass={"main-button center-element"} clickHandler={()=>{
                            confirmFn()
                            setIsActive(!isActive)
                        }}/>
                    <MainButton component={<>
                        <Close_icon/>
                        <p>Cancel</p>
                    </>} btnClass={"main-button center-element"} clickHandler={()=>setIsActive(!isActive)} />
                </div>
            </div>
        </PopUpMenu>
    </div>
}