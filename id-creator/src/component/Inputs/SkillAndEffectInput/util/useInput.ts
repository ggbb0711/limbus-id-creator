import { ICustomEffect } from "Interfaces/CustomEffect/ICustomEffect";
import { IDefenseSkill } from "Interfaces/DefenseSkill/IDefenseSkill";
import { IMentalEffect } from "Interfaces/MentalEffect/IMentalEffect";
import { IOffenseSkill } from "Interfaces/OffenseSkill/IOffenseSkill";
import { IPassiveSkill } from "Interfaces/PassiveSkill/IPassiveSkill";
import { useIdInfoContext } from "component/context/IdInfoContext";
import React, { useEffect, useState } from "react";

export default function useInput(colIndex:number,inputIndex:number){
    const {idInfoValue,setIdInfoValue}=useIdInfoContext()
    const [inputs,setInputs]=useState<IOffenseSkill|IDefenseSkill|IPassiveSkill|ICustomEffect|IMentalEffect>(idInfoValue.cols[colIndex][inputIndex])

    function changeInput(newVal:IOffenseSkill|IDefenseSkill|IPassiveSkill|ICustomEffect|IMentalEffect){
        const newCols=[...idInfoValue.cols]
        newCols[colIndex][inputIndex]=newVal
        const newIdInfoValue={...idInfoValue,cols:newCols}
        setIdInfoValue(newIdInfoValue)
    }

    function onChangeInput(e:React.ChangeEvent<HTMLInputElement>|React.ChangeEvent<HTMLTextAreaElement>){
        changeInput({...inputs,[e.target.name]:e.target.value})
    }

    function onChangeDropDownMenu(dropDownName:string){
        return (newVal:string)=>{
            changeInput({...inputs,[dropDownName]:newVal})
        }
    }

    function onChangeFile(e:React.ChangeEvent<HTMLInputElement>){
        const files=e.currentTarget.files
        changeInput({...inputs,[e.target.name]:(files)?URL.createObjectURL(files[0]):""})
    }

    function deleteInput(){
        const newIdInfoValue=idInfoValue

        newIdInfoValue.cols[colIndex].splice(inputIndex,1)

        setIdInfoValue({...idInfoValue})
    }

    useEffect(()=>{
        if(JSON.stringify(idInfoValue.cols[colIndex][inputIndex])!==JSON.stringify(inputs)) setInputs(idInfoValue.cols[colIndex][inputIndex])
    },[idInfoValue.cols[colIndex][inputIndex]])

    return {inputs,onChangeInput,onChangeDropDownMenu,onChangeFile,deleteInput}
    
}