import { ICustomEffect } from "Interfaces/CustomEffect/ICustomEffect";
import { IDefenseSkill } from "Interfaces/DefenseSkill/IDefenseSkill";
import { IOffenseSkill, OffenseSkill } from "Interfaces/OffenseSkill/IOffenseSkill";
import { IPassiveSkill } from "Interfaces/PassiveSkill/IPassiveSkill";
import { useIdInfoContext } from "component/context/IdInfoContext";
import React, { ReactElement, useState } from "react";
import uuid from "../../../../node_modules/react-uuid/uuid";
import OffenseSkillInput from "../SkillAndEffectInput/OffenseSkillInput/OffenseSkillInput";
import DropDown from "component/DropDown/DropDown";

export default function IdColInput({index}:{index:number}):ReactElement{
    const {idInfoValue,setIdInfoValue}=useIdInfoContext()
    const [inputType,setInputType]=useState<string>("OffenseSkill")

    function addInput(){
        const newIdInfoValue=idInfoValue

        switch(inputType){
            case"OffenseSkill":{
                newIdInfoValue.cols[index].push(new OffenseSkill())
                break;
            }
            default:{
                break;
            }
        }
        setIdInfoValue({...newIdInfoValue})
    }

    return(<div>
        {idInfoValue.cols[index].map((input:IOffenseSkill|IDefenseSkill|IPassiveSkill|ICustomEffect,i:number)=>{
            console.log(input)
            switch(input.type){
                case "OffenseSkill":{
                    return <OffenseSkillInput colIndex={index} inputIndex={i} key={i}/>
                }
                default:{
                    break
                }
            }
        })}
        <DropDown dropDownEl={{
            OffenseSkill:{
                el:<p>Offensive skill</p>,
                value:"OffenseSkill"
            }
        }} cb={setInputType}/>
        <button onClick={addInput}>Add input</button>
    </div>)
}