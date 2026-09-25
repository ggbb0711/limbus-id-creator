import React from "react";
import { ReactElement } from "react";
import "./DamageTypeInput.css"

export default function DamageTypeInput({onChangeDamageType,activeDamageType,disabled}:{onChangeDamageType:(damageType:string)=>void,activeDamageType:string,disabled?:boolean}):ReactElement{
    return <div className="damage-type-input-container">
        {disabled?<div className="disabled"></div>:<></>}
        <img src="/Images/attack/attackt_Blunt.webp" alt="damage-Blunt-icon" className={`damage-type-input-option ${activeDamageType==="Blunt"?"active":""}`} onClick={()=>onChangeDamageType("Blunt")} />
        <img src="/Images/attack/attackt_Pierce.webp" alt="damage-Pierce-icon" className={`damage-type-input-option ${activeDamageType==="Pierce"?"active":""}`} onClick={()=>onChangeDamageType("Pierce")} />
        <img src="/Images/attack/attackt_Slash.webp" alt="damage-Slash-icon" className={`damage-type-input-option ${activeDamageType==="Slash"?"active":""}`} onClick={()=>onChangeDamageType("Slash")} />
    </div>
}