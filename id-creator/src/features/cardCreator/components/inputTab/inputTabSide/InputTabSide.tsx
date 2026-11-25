import { appConfig } from "config/env.client";
import AddIcon from "assets/icons/AddIcon";
import React, { ReactElement, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import "./InputTabSide.css"
import ResetIcon from "assets/icons/ResetIcon";
import { SkillDetail, isActiveSkill } from "features/cardCreator/types/SkillDetail";
import { SKILL_TYPES } from "features/cardCreator/types/SkillTypes";
import { SKILL_DATA, getSkillData } from "features/cardCreator/skills/skillData";
import { DndItemType } from "features/cardCreator/constants";

interface SkillTabDragItem {
    skill: SkillDetail
}

function SkillTab({skill, isActive, onSelect, onDropSkill}:{
        skill:SkillDetail,
        isActive:boolean,
        onSelect:()=>void,
        onDropSkill:(fromId:string)=>void
    }):ReactElement{
    const skillData = getSkillData(skill.type)

    const [{isDragging},drag] = useDrag(()=>({
        type:DndItemType.SkillTab,
        item:{skill},
        collect:monitor=>({isDragging:monitor.isDragging()})
    }),[skill])

    const [{isOver},drop] = useDrop(()=>({
        accept:DndItemType.SkillTab,
        drop:(item:SkillTabDragItem)=>onDropSkill(item.skill.inputId),
        collect:monitor=>({isOver:monitor.isOver() && monitor.getItem<SkillTabDragItem>()?.skill.inputId !== skill.inputId})
    }),[onDropSkill, skill.inputId])

    return <li ref={node => { drag(drop(node)) }} className={`input-tab-side ${isActive?"active":""} ${isDragging?"dragging":""} ${isOver?"drop-target":""}`}
        onClick={onSelect} style={{
            background:`var(--${isActiveSkill(skill)?skill.skillAffinity:"None"}-input-page)`
        }}>
        <img src={skillData.tabIcon(skill)} alt={skillData.tabLabel} crossOrigin="anonymous" draggable={false}/>
    </li>
}

export default function InputTabSide({sinnerIcon,
    skillDetails,
    changeTab,
    activeTab,
    addTab,
    resetBtnHandler,
    moveSkill}:{sinnerIcon:string,
        skillDetails:SkillDetail[],changeTab:(newTab:number)=>void,
        activeTab:number,
        addTab:(skill:SkillDetail)=>void,
        resetBtnHandler:()=>void,
        moveSkill:(fromId:string,toId:string)=>void}
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
                <img src={sinnerIcon} alt="Card info" crossOrigin="anonymous" />
            </li>
            {skillDetails.map((skill,i)=>
                <SkillTab key={skill.inputId} skill={skill} isActive={activeTab===i}
                    onSelect={()=>changeTab(i)}
                    onDropSkill={fromId=>moveSkill(fromId, skill.inputId)}/>
            )}
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
                    {data.addLabel} <img src={data.icon} alt="" />
                </li>
            })}
        </ul>:<></>}
    </ul>
}
