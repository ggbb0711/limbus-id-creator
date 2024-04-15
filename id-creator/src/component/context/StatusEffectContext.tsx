import { IStatusEffect } from 'Interfaces/StatusEffect/IStatusEffect';
import React, { useEffect } from 'react'
import { ReactElement, createContext, useContext, useState } from "react";
import { baseStatusEffect } from 'utils/baseStatusEffect';
import { useIdInfoContext } from './IdInfoContext';
import { ICustomEffect } from 'Interfaces/CustomEffect/ICustomEffect';
import { IDefenseSkill } from 'Interfaces/DefenseSkill/IDefenseSkill';
import { IMentalEffect } from 'Interfaces/MentalEffect/IMentalEffect';
import { IOffenseSkill } from 'Interfaces/OffenseSkill/IOffenseSkill';
import { IPassiveSkill } from 'Interfaces/PassiveSkill/IPassiveSkill';

const statusEffectContext = createContext(null)

const StatusEffectProvider: React.FC<{children:ReactElement}>=({children})=>{
    const [statusEffect,setStatusEffect]=useState<{[key:string]:string}>(baseStatusEffect)
    const {idInfoValue}=useIdInfoContext()

    function addNewStatusEffect(customEffect:ICustomEffect):string{
        return `<span contenteditable='false' style='${customEffect.effectColor?`color:${customEffect.effectColor};`:''}text-decoration:underline;'>${customEffect.customImg?`<img class='status-icon' src='${customEffect.customImg}' alt='custom_icon' />`:''}${customEffect.name}</span>`
    }

    useEffect(()=>{
        const statusObj={}
        idInfoValue.skillDetails.forEach((skill:(IOffenseSkill|IDefenseSkill|IPassiveSkill|ICustomEffect|IMentalEffect|never))=>{
            if(skill.type==="CustomEffect"){
                const CustomEffect=skill as ICustomEffect
                if(CustomEffect.name){
                    statusObj[CustomEffect.name.replace(/\s/g,"_").toLowerCase()]=addNewStatusEffect(CustomEffect)
                }
            }
        })
        setStatusEffect({...baseStatusEffect,...statusObj})
    },[JSON.stringify(idInfoValue.skillDetails)])

    return <statusEffectContext.Provider value={{statusEffect,setStatusEffect}}>
            {children}
        </statusEffectContext.Provider>;
}

const useStatusEffectContext = () => useContext(statusEffectContext)

export {StatusEffectProvider,useStatusEffectContext}
