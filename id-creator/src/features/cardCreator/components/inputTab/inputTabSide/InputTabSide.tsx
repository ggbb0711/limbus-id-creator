import { appConfig } from "config/env.client";
import AddIcon from "assets/icons/AddIcon";
import React, { useState } from "react";
import "./InputTabSide.css"
import ResetIcon from "assets/icons/ResetIcon";
import { SkillDetail, isActiveSkill } from "features/cardCreator/types/SkillDetail";
import { SKILL_TYPES } from "features/cardCreator/types/SkillTypes";
import { SKILL_DATA, getSkillData } from "features/cardCreator/skills/skillData";

export default function InputTabSide({sinnerIcon,
    skillDetails,
    changeTab,
    activeTab,
    addTab,
    resetBtnHandler}:{sinnerIcon:string,
        skillDetails:SkillDetail[],changeTab:(newTab:number)=>void,
        activeTab:number,
        addTab:(skill:SkillDetail)=>void,
        resetBtnHandler:()=>void}
    ){
    
    const [isAdding,setIsAdding] = useState(false)

    return <ul className="input-tab-side-container">
        <li className="input-tab-side icon-side" onClick={()=>{
            if(skillDetails.length<appConfig.limits.card.maxSkills) setIsAdding(!isAdding)
        }}>
            <AddIcon/>
        </li>
        <ul className="input-tab-side-mini-container">
            <li className={`input-tab-side ${activeTab===-1?"active":""}`} onClick={()=>changeTab(-1)}
                style={{
                    background:'var(--None-input-page)'
                }}>
                <img src={sinnerIcon} alt="" crossOrigin="anonymous" />
            </li>
            {skillDetails.map((skill,i)=>{
                const tabIcon = getSkillData(skill.type).tabIcon(skill)

                return <li className={`input-tab-side ${activeTab===i?"active":""}`} key={skill.inputId} 
                onClick={()=>changeTab(i)} style={{
                        background:`var(--${isActiveSkill(skill)?skill.skillAffinity:"None"}-input-page)`
                    }}>
                    <img src={tabIcon} alt="" crossOrigin="anonymous"/>
                </li>
            })}
        </ul>
        
        <li className="input-tab-side icon-side reset-icon-side"
            onClick={resetBtnHandler}>
            <ResetIcon/>
        </li>
        {isAdding?<ul className="input-tab-side-add-option-container">
            {SKILL_TYPES.map(type=>{
                const data = SKILL_DATA[type]
                return <li className="input-tab-side-add-option" key={type}
                    onClick={()=>{
                        addTab(data.create())
                        setIsAdding(false)
                    }}>
                    {data.addLabel} <img src={data.icon} alt={data.iconAlt} />
                </li>
            })}
        </ul>:<></>}
    </ul>
}