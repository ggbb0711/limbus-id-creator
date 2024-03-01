import { ICustomEffect } from "Interfaces/CustomEffect/ICustomEffect";
import { IDefenseSkill } from "Interfaces/DefenseSkill/IDefenseSkill";
import { IOffenseSkill } from "Interfaces/OffenseSkill/IOffenseSkill";
import { IPassiveSkill } from "Interfaces/PassiveSkill/IPassiveSkill";
import { useIdInfoContext } from "component/context/IdInfoContext";
import React, { ReactElement } from "react";
import IdColInput from "./IdColInput";
import uuid from "../../../../node_modules/react-uuid/uuid";

export default function IdColInputContainer():ReactElement{
    const {idInfoValue,setIdInfoValue}=useIdInfoContext();

    function addCol(){
        const newCols=[...idInfoValue.cols,[]]
        setIdInfoValue({...idInfoValue,cols:newCols})
    }

    return(
        <>
            {idInfoValue.cols.map((col:[IOffenseSkill|IDefenseSkill|IPassiveSkill|ICustomEffect]|never[],i:number)=>(
                <div key={i}>
                    <IdColInput index={i}/>
                </div>
                
            ))}
            <button onClick={addCol}>Add more col</button>
        </>

    )
}