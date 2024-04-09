import { CustomEffect, ICustomEffect } from "Interfaces/CustomEffect/ICustomEffect";
import { DefenseSkill, IDefenseSkill } from "Interfaces/DefenseSkill/IDefenseSkill";
import { IMentalEffect, MentalEffect } from "Interfaces/MentalEffect/IMentalEffect";
import { IOffenseSkill, OffenseSkill } from "Interfaces/OffenseSkill/IOffenseSkill";
import { IPassiveSkill, PassiveSkill } from "Interfaces/PassiveSkill/IPassiveSkill";
import { useIdInfoContext } from "component/context/IdInfoContext";
import { useStatusEffectContext } from "component/context/StatusEffectContext";
import React, { useEffect, useState } from "react";
import replaceKeyWord from "./replaceKeyWord";

export default function useSkillInput(skillIndex:number){
    const {idInfoValue,setIdInfoValue}=useIdInfoContext()
    const {statusEffect}=useStatusEffectContext()
    const [inputs,setInputs]=useState<IOffenseSkill|IDefenseSkill|IPassiveSkill|ICustomEffect|IMentalEffect>(idInfoValue.skillDetails[skillIndex])

    function changeInput(newVal:IOffenseSkill|IDefenseSkill|IPassiveSkill|ICustomEffect|IMentalEffect){
        const newSkillDetails=[...idInfoValue.skillDetails]
        newSkillDetails[skillIndex]=newVal
        const newIdInfoValue={...idInfoValue,skillDetails:newSkillDetails}
        setIdInfoValue(newIdInfoValue)
    }

    function onChangeInput(inputName?:string){
        return(e:React.ChangeEvent<HTMLInputElement>|React.ChangeEvent<HTMLTextAreaElement>)=>{
            if(inputName) changeInput({...inputs,[inputName]:e.target.value})
            else{
                changeInput({...inputs,[e.target.name]:e.target.value})
            }
        }
    }

    function onChangeAutoCorrectInput(inputName?:string){
        return(e:React.ChangeEvent<HTMLInputElement>|React.ChangeEvent<HTMLTextAreaElement>)=>{
            if(inputName) changeInput({...inputs,[inputName]:replaceKeyWord(e.target.value,statusEffect)})
            else{
                changeInput({...inputs,[e.target.name]:replaceKeyWord(e.target.value,statusEffect)})
            }
        }
    }

    function onChangeDropDownMenu(dropDownName:string){
        return (newVal:string)=>{
            changeInput({...inputs,[dropDownName]:newVal})
        }
    }

    function onChangeFile(e:React.ChangeEvent<HTMLInputElement>){
        const files=e.currentTarget.files
        changeInput({...inputs,[e.target.name]:(files.length>0)?URL.createObjectURL(files[0]):""})
    }

    function onChangeFileWithName(inputName:string){
        return(e:React.ChangeEvent<HTMLInputElement>)=>{
            const files=e.currentTarget.files
            changeInput({...inputs,[inputName]:(files.length>0)?URL.createObjectURL(files[0]):""})
        }
    }

    function deleteInput(){
        const newIdInfoValue={...idInfoValue}

        newIdInfoValue.skillDetails.splice(skillIndex,1)

        setIdInfoValue({...idInfoValue})
    }

    function changeSkillType(newVal:string){
        const newIdInfoValue={...idInfoValue}

        const changeSkillType={
            OffenseSkill:new OffenseSkill(),
            DefenseSkill:new DefenseSkill(),
            PassiveSkill:new PassiveSkill(),
            CustomEffect:new CustomEffect(),
            MentalEffect:new MentalEffect()
        }

        newIdInfoValue.skillDetails.splice(skillIndex,1,changeSkillType[newVal])

        setIdInfoValue({...idInfoValue})
    }

    useEffect(()=>{
        if(JSON.stringify(idInfoValue.skillDetails[skillIndex])!==JSON.stringify(inputs)) setInputs(idInfoValue.skillDetails[skillIndex])
    },[idInfoValue.skillDetails[skillIndex]])

    return {inputs,onChangeInput,onChangeAutoCorrectInput,onChangeDropDownMenu,onChangeFile,onChangeFileWithName,deleteInput,changeSkillType}
    
}