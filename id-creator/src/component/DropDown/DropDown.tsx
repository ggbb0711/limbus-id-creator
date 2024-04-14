import React, { useEffect, useState } from "react";
import { ReactElement } from "react";
import "./DropDown.css"
import Arrow_down_icon from "Icons/Arrow_down_icon";

export interface dropDownEl{
    el:ReactElement,
    style?:{[key:string]:string},
    value:string,
    cb?:(newVal:string)=>void
}

export default function DropDown({dropDownEl,propVal,disabled,cb}:{dropDownEl:{[key:string]:dropDownEl},propVal?:string,disabled?:boolean,cb:(newVal:string)=>void}):ReactElement{
    const [currVal,setCurrVal]=useState((propVal)?dropDownEl[propVal]:Object.values(dropDownEl)[0])
    const [isActive,setIsActive]=useState(false)

    useEffect(()=>{
        if(propVal) setCurrVal(dropDownEl[propVal])
    },[propVal])

    return(
        <div className="drop-down-container">
            {disabled?<div className="disabled-block"></div>:<></>}
            <div className="curr-el" onClick={()=>setIsActive(!isActive)}>
                {currVal.el}
                <span className="arrow-down">
                    <Arrow_down_icon/>
                </span>    
            </div>
            <ul className={`drop-down ${isActive?"active":""}`}>
                {Object.keys(dropDownEl).map((key,i)=>
                    <li key={i} onClick={()=>{
                            if(dropDownEl[key].cb)dropDownEl[key].cb(dropDownEl[key].value)
                            else cb(dropDownEl[key].value)
                            setCurrVal(dropDownEl[key])
                            setIsActive(!isActive)
                        }} className="drop-down-el" style={dropDownEl[key].style}>
                        {dropDownEl[key].el}
                    </li>
                )}
            </ul>
        </div>
    )
}