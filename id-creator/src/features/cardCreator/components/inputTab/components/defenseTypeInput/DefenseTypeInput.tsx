import React from "react";
import { ReactElement } from "react";
import "./DefenseTypeInput.css"

export default function DefenseTypeInput({onChangeDefenseType,activeDefenseType}:{onChangeDefenseType:(damageType:string)=>void,activeDefenseType:string}):ReactElement{
    return <div className="defense-type-input-container">
        <img src="/Images/defense/defense_Block.webp" alt="defense-Block-icon" className={`defense-type-input-option ${activeDefenseType==="Block"?"active":""}`} onClick={()=>onChangeDefenseType("Block")} />
        <img src="/Images/defense/defense_Dodge.webp" alt="defense-Dodge-icon" className={`defense-type-input-option ${activeDefenseType==="Dodge"?"active":""}`} onClick={()=>onChangeDefenseType("Dodge")} />
        <img src="/Images/defense/defense_Counter.webp" alt="defense-Counter-icon" className={`defense-type-input-option ${activeDefenseType==="Counter"?"active":""}`} onClick={()=>onChangeDefenseType("Counter")} />
    </div>
}