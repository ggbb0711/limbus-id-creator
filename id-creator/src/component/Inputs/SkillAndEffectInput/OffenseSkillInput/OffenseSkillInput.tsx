import { ICustomEffect } from "Interfaces/CustomEffect/ICustomEffect";
import { IDefenseSkill } from "Interfaces/DefenseSkill/IDefenseSkill";
import { IOffenseSkill } from "Interfaces/OffenseSkill/IOffenseSkill";
import { IPassiveSkill } from "Interfaces/PassiveSkill/IPassiveSkill";
import { useIdInfoContext } from "component/context/IdInfoContext";
import React, { ReactElement, useEffect, useState } from "react";
import uuid from "../../../../../node_modules/react-uuid/uuid";
import DropDown from "component/DropDown/DropDown";
import { damageTypeDropDown } from "component/util/DropDownObjects/damageType";
import { skillAffinityDropDown } from "component/util/DropDownObjects/SinAffinity";

export default function OffenseSkillInput({colIndex,inputIndex}:{colIndex:number,inputIndex:number}):ReactElement{
    const {idInfoValue,setIdInfoValue}=useIdInfoContext()
    const [inputs,setInputs]=useState<IOffenseSkill>(idInfoValue.cols[colIndex][inputIndex])

    function changeInput(newVal:IOffenseSkill){
        const newCols=[...idInfoValue.cols]
        newCols[colIndex][inputIndex]=newVal
        const newIdInfoValue={...idInfoValue,cols:newCols}
        setIdInfoValue(newIdInfoValue)
    }

    function onChangeTextInput(e:React.ChangeEvent<HTMLInputElement>){
        changeInput({...inputs,[e.target.name]:e.target.value})
    }

    function deleteInput(){
        const newIdInfoValue=idInfoValue

        newIdInfoValue.cols[colIndex].splice(inputIndex,1)

        setIdInfoValue({...idInfoValue})
    }

    useEffect(()=>{
        if(JSON.stringify(idInfoValue.cols[colIndex][inputIndex])!==JSON.stringify(inputs)) setInputs(idInfoValue.cols[colIndex][inputIndex])
    },[idInfoValue.cols[colIndex][inputIndex]])
    
    return(
        <div>
            <button onClick={deleteInput}>Delete</button>
            <DropDown dropDownEl={damageTypeDropDown} propVal={inputs.damageType} cb={(newVal)=>setInputs({...inputs,damageType:newVal})}/>
            <DropDown dropDownEl={skillAffinityDropDown} propVal={inputs.skillAffinity} cb={(newVal)=>setInputs({...inputs,skillAffinity:newVal})}/>
            <div>
                <label htmlFor={colIndex+'_'+inputIndex+'_name'}>Skill name:</label>
                <input type="text" name="name" id={colIndex+'_'+inputIndex+'_name'} onChange={onChangeTextInput} value={inputs.name} placeholder="Skill name"/>
            </div>
            <div>
                <label htmlFor={colIndex+'_'+inputIndex+'_basePower'}>Base power:</label>
                <input type="number" name="basePower" id={colIndex+'_'+inputIndex+'_basePower'} onChange={onChangeTextInput} value={inputs.basePower} placeholder="Base power"/>
            </div>
            <div>
                <label htmlFor={colIndex+'_'+inputIndex+'_coinNo'}>Number of coins:</label>
                <input type="number" name="coinNo" id={colIndex+'_'+inputIndex+'_coinNo'} onChange={onChangeTextInput} value={inputs.coinNo} placeholder="Coin number"/>
            </div>
            <div>
                <label htmlFor={colIndex+'_'+inputIndex+'_coinPower'}>Coin power:</label>
                <input type="number" name="coinPow" id={colIndex+'_'+inputIndex+'_coinPower'} onChange={onChangeTextInput} value={inputs.coinPow} placeholder="Coin power"/>
            </div>
            <div>
                <label htmlFor={colIndex+'_'+inputIndex+'_skillLabel'}>Skill label:</label>
                <input type="text" name="name" id={colIndex+'_'+inputIndex+'_skillLabel'} onChange={onChangeTextInput} value={inputs.skillLabel} placeholder="Skill label"/>
            </div>
        </div>
    )
}