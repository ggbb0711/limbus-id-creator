import React from "react";
import { ReactElement } from "react";
import "./SinAffinityInput.css"

export default function SinAffinityInput({onChangeSinAffinity,activeSin,disabled}:{onChangeSinAffinity:(sinAffinity:string)=>void,activeSin:string,disabled?:boolean}):ReactElement{
    return <div className="sin-affinity-input-container">
        {disabled?<div className="disabled"></div>:<></>}
        <img className={`sin-affinity-input-option ${activeSin==="Wrath"?"active":""}`} src="Images/sin-affinity/affinity_Wrath_big.webp" alt="sin-Wrath-icon" onClick={()=>onChangeSinAffinity("Wrath")}/>
        <img className={`sin-affinity-input-option ${activeSin==="Lust"?"active":""}`} src="Images/sin-affinity/affinity_Lust_big.webp" alt="sin-Lust-icon" onClick={()=>onChangeSinAffinity("Lust")}/>
        <img className={`sin-affinity-input-option ${activeSin==="Sloth"?"active":""}`} src="Images/sin-affinity/affinity_Sloth_big.webp" alt="sin-Sloth-icon" onClick={()=>onChangeSinAffinity("Sloth")}/>
        <img className={`sin-affinity-input-option ${activeSin==="Gluttony"?"active":""}`} src="Images/sin-affinity/affinity_Gluttony_big.webp" alt="sin-Gluttony-icon" onClick={()=>onChangeSinAffinity("Gluttony")}/>
        <img className={`sin-affinity-input-option ${activeSin==="Gloom"?"active":""}`} src="Images/sin-affinity/affinity_Gloom_big.webp" alt="sin-Gloom-icon" onClick={()=>onChangeSinAffinity("Gloom")}/>
        <img className={`sin-affinity-input-option ${activeSin==="Pride"?"active":""}`} src="Images/sin-affinity/affinity_Pride_big.webp" alt="sin-Pride-icon" onClick={()=>onChangeSinAffinity("Pride")}/>
        <img className={`sin-affinity-input-option ${activeSin==="Envy"?"active":""}`} src="Images/sin-affinity/affinity_Envy_big.webp" alt="sin-Envy-icon" onClick={()=>onChangeSinAffinity("Envy")}/>
        <div className={`sin-affinity-input-option ${activeSin==="None"?"active":""}`} onClick={()=>onChangeSinAffinity("None")}>None</div>
    </div>
}