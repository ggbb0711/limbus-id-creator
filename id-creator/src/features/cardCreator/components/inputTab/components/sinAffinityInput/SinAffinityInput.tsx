import React from "react";
import { ReactElement } from "react";
import "./SinAffinityInput.css"
import { SinAffinity } from "features/cardCreator/constants";

export default function SinAffinityInput({onChangeSinAffinity,activeSin,disabled}:{onChangeSinAffinity:(sinAffinity:SinAffinity)=>void,activeSin:SinAffinity,disabled?:boolean}):ReactElement{
    return <div className="sin-affinity-input-container">
        {disabled?<div className="disabled"></div>:<></>}
        <img className={`sin-affinity-input-option ${activeSin==="Wrath"?"active":""}`} src="/Images/sin-affinity/affinity_Wrath_big.webp" alt="Wrath" onClick={()=>onChangeSinAffinity("Wrath")}/>
        <img className={`sin-affinity-input-option ${activeSin==="Lust"?"active":""}`} src="/Images/sin-affinity/affinity_Lust_big.webp" alt="Lust" onClick={()=>onChangeSinAffinity("Lust")}/>
        <img className={`sin-affinity-input-option ${activeSin==="Sloth"?"active":""}`} src="/Images/sin-affinity/affinity_Sloth_big.webp" alt="Sloth" onClick={()=>onChangeSinAffinity("Sloth")}/>
        <img className={`sin-affinity-input-option ${activeSin==="Gluttony"?"active":""}`} src="/Images/sin-affinity/affinity_Gluttony_big.webp" alt="Gluttony" onClick={()=>onChangeSinAffinity("Gluttony")}/>
        <img className={`sin-affinity-input-option ${activeSin==="Gloom"?"active":""}`} src="/Images/sin-affinity/affinity_Gloom_big.webp" alt="Gloom" onClick={()=>onChangeSinAffinity("Gloom")}/>
        <img className={`sin-affinity-input-option ${activeSin==="Pride"?"active":""}`} src="/Images/sin-affinity/affinity_Pride_big.webp" alt="Pride" onClick={()=>onChangeSinAffinity("Pride")}/>
        <img className={`sin-affinity-input-option ${activeSin==="Envy"?"active":""}`} src="/Images/sin-affinity/affinity_Envy_big.webp" alt="Envy" onClick={()=>onChangeSinAffinity("Envy")}/>
        <div className={`sin-affinity-input-option ${activeSin==="None"?"active":""}`} onClick={()=>onChangeSinAffinity("None")}>None</div>
    </div>
}