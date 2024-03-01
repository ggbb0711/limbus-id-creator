import React, { useEffect, useState } from "react";
import { ReactElement } from "react";
import "./DropDown.css"

export interface dropDownEl{
    el:ReactElement,
    style?:{[key:string]:string},
    value:string,
    cb?:(newVal:string)=>void
}

export default function DropDown({dropDownEl,propVal,cb}:{dropDownEl:{[key:string]:dropDownEl},propVal?:string,cb:(newVal:string)=>void}):ReactElement{
    const [currVal,setCurrVal]=useState((propVal)?dropDownEl[propVal]:Object.values(dropDownEl)[0])

    useEffect(()=>{
        if(propVal) setCurrVal(dropDownEl[propVal])
    },[propVal])

    return(
        <div className="drop-down-container">
            <div className="curr-el">{currVal.el}</div>
            <ul className={`drop-down`}>
                {Object.keys(dropDownEl).map((key,i)=>
                    <li key={i} onClick={()=>{
                            if(dropDownEl[key].cb)dropDownEl[key].cb(dropDownEl[key].value)
                            else cb(dropDownEl[key].value)
                            setCurrVal(dropDownEl[key])
                        }} className="drop-down-el" style={dropDownEl[key].style}>
                        {dropDownEl[key].el}
                    </li>
                )}
            </ul>
        </div>
    )
}