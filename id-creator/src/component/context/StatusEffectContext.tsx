import React, { useEffect } from 'react'
import { ReactElement, createContext, useContext, useState } from "react";
import { baseStatusEffect } from 'utils/baseStatusEffect';
import { ICustomEffect } from 'Interfaces/CustomEffect/ICustomEffect';
import { IDefenseSkill } from 'Interfaces/DefenseSkill/IDefenseSkill';
import { IMentalEffect } from 'Interfaces/MentalEffect/IMentalEffect';
import { IOffenseSkill } from 'Interfaces/OffenseSkill/IOffenseSkill';
import { IPassiveSkill } from 'Interfaces/PassiveSkill/IPassiveSkill';
import { ICustomKeyword } from 'Interfaces/ICustomKeyword';

const statusEffectContext = createContext(null)

const StatusEffectProvider: React.FC<{children:ReactElement,skillDetails:(IOffenseSkill|IDefenseSkill|IPassiveSkill|ICustomEffect|IMentalEffect|never)[]}>=({children,skillDetails})=>{
    const [statusEffect,setStatusEffect]=useState<{[key:string]:string}>(baseStatusEffect)
    const [skillCustomEffects,setSkillCustomEffects] = useState<{[key:string]:string}>({})
    const [localCustomKeywords,setLocalCustomKeywords] = useState<{[key:string]:string}>({})

    function addNewStatusEffect(customEffect:ICustomEffect):string{
        return `<span class='center-element' contenteditable='false' style='${customEffect.effectColor?`color:${customEffect.effectColor};`:''}text-decoration:underline;'>${customEffect.customImg?`<img class='status-icon' src='${customEffect.customImg}' alt='custom_icon' />`:''}${customEffect.name}</span>`
    }

    useEffect(()=>{
        const statusObj={}
        skillDetails.forEach((skill:(IOffenseSkill|IDefenseSkill|IPassiveSkill|ICustomEffect|IMentalEffect|never))=>{
            if(skill.type==="CustomEffect"){
                const CustomEffect=skill as ICustomEffect
                if(CustomEffect.name){
                    statusObj[CustomEffect.name.replace(/\s/g,"_").toLowerCase()]=addNewStatusEffect(CustomEffect)
                }
            }
        })
        setSkillCustomEffects(statusObj)
    },[JSON.stringify(skillDetails)])

    useEffect(()=>{
        const customKeywordString = localStorage.getItem("customKeywords")
        if(customKeywordString){
            const customKeywords = JSON.parse(customKeywordString)
            const statusObj = {}
            customKeywords.forEach((keyword:ICustomKeyword) => {
              statusObj[keyword.keyword.replace(/\s/g,"_").toLowerCase()] =
                `<span class='center-element' contenteditable='false' style='color:${keyword.color}'>${keyword.keyword}</span>`
            })
            setLocalCustomKeywords(statusObj)
        }
    },[localStorage.getItem("customKeywords")])

    useEffect(()=>{
        setStatusEffect({...baseStatusEffect,...skillCustomEffects,...localCustomKeywords})
    },[JSON.stringify(skillCustomEffects),JSON.stringify(localCustomKeywords)])

    return <statusEffectContext.Provider value={{statusEffect,setStatusEffect}}>
            {children}
        </statusEffectContext.Provider>;
}

const useStatusEffectContext = () => useContext(statusEffectContext)

export {StatusEffectProvider,useStatusEffectContext}
