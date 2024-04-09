import { useIdInfoContext } from "component/context/IdInfoContext";
import React from "react";
import { ReactElement } from "react";
import "./RarityIconInput.css"
import { IIdInfo } from "Interfaces/IIdInfo";

export default function SinnerRarityIconInput():ReactElement{
    const {idInfoValue,setIdInfoValue} = useIdInfoContext()

    
    return <div className="rarity-icon-container">
        <img onClick={()=>setIdInfoValue((idInfo:IIdInfo)=>({...idInfo,rarity:"Images/rarity/IDNumber1.png"}))} className={`rarity-icon ${idInfoValue.rarity==="Images/rarity/IDNumber1.png"?"active":""}`} src="Images/rarity/IDNumber1.png" alt="rarity-icon-1.png" />
        <img onClick={()=>setIdInfoValue((idInfo:IIdInfo)=>({...idInfo,rarity:"Images/rarity/IDNumber2.png"}))} className={`rarity-icon ${idInfoValue.rarity==="Images/rarity/IDNumber2.png"?"active":""}`} src="Images/rarity/IDNumber2.png" alt="rarity-icon-2.png" />
        <img onClick={()=>setIdInfoValue((idInfo:IIdInfo)=>({...idInfo,rarity:"Images/rarity/IDNumber3.png"}))} className={`rarity-icon ${idInfoValue.rarity==="Images/rarity/IDNumber3.png"?"active":""}`} src="Images/rarity/IDNumber3.png" alt="rarity-icon-3.png" />
    </div>
}