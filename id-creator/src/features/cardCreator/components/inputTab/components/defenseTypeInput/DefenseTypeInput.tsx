import React from "react";
import { ReactElement } from "react";
import "./DefenseTypeInput.css"
import { DefenseType } from "features/cardCreator/constants";

export default function DefenseTypeInput({onChangeDefenseType,activeDefenseType}:{onChangeDefenseType:(defenseType:DefenseType)=>void,activeDefenseType:DefenseType}):ReactElement{
    return <div className="defense-type-input-container">
        <img src="/Images/defense/defense_Block.webp" alt="Block" className={`defense-type-input-option ${activeDefenseType==="Block"?"active":""}`} onClick={()=>onChangeDefenseType("Block")} />
        <img src="/Images/defense/defense_Dodge.webp" alt="Dodge" className={`defense-type-input-option ${activeDefenseType==="Dodge"?"active":""}`} onClick={()=>onChangeDefenseType("Dodge")} />
        <img src="/Images/defense/defense_Counter.webp" alt="Counter" className={`defense-type-input-option ${activeDefenseType==="Counter"?"active":""}`} onClick={()=>onChangeDefenseType("Counter")} />
        <img src="/Images/defense/defense_ClashableCounter.webp" alt="Clashable Counter" className={`defense-type-input-option ${activeDefenseType==="ClashableCounter"?"active":""}`} onClick={()=>onChangeDefenseType("ClashableCounter")} />
        <img src="/Images/defense/defense_ClashableGuard.webp" alt="Clashable Guard" className={`defense-type-input-option ${activeDefenseType==="ClashableGuard"?"active":""}`} onClick={()=>onChangeDefenseType("ClashableGuard")} />
    </div>
}