import AddIcon from "assets/icons/AddIcon";
import React, { useState } from "react";
import "./InputTabSide.css"
import ResetIcon from "assets/icons/ResetIcon";
import { createOffenseSkill } from "features/cardCreator/types/skills/offenseSkill/IOffenseSkill";
import { createDefenseSkill } from "features/cardCreator/types/skills/defenseSkill/IDefenseSkill";
import { createCustomEffect } from "features/cardCreator/types/skills/customEffect/ICustomEffect";
import { createMentalEffect } from "features/cardCreator/types/skills/mentalEffect/IMentalEffect";
import { createPassiveSkill } from "features/cardCreator/types/skills/passiveSkill/IPassiveSkill";
import { SkillDetail, isActiveSkill } from "features/cardCreator/types/SkillDetail";
import { SkillType } from "features/cardCreator/types/SkillTypes";

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

    function convertTabIcon(type:SkillType):string{
        switch (type){
            case "OffenseSkill":{
                return "/Images/stat/stat_attack.webp"
            }
            case "DefenseSkill":{
                return "/Images/stat/stat_defense.webp"
            }
            case "PassiveSkill":{
                return "/Images/status-effect/Aggro.webp"
            }
            case "CustomEffect":{
                return "/Images/status-effect/Discard.webp"
            }
            case "MentalEffect":{
                return "/Images/Sanity.webp"
            }
        }
    }

    return <ul className="input-tab-side-container">
        <li className="input-tab-side icon-side" onClick={()=>{
            if(skillDetails.length<40) setIsAdding(!isAdding)
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
                const tabIcon = skill.type==="CustomEffect" && skill.customImg ? skill.customImg : convertTabIcon(skill.type)

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
            <li className="input-tab-side-add-option"
                onClick={()=>{
                    addTab(createOffenseSkill())
                    setIsAdding(false)
                }}>
                Add offense skill <img src="/Images/stat/stat_attack.webp" alt="attk_icon" />
            </li>
            <li className="input-tab-side-add-option"
                onClick={()=>{
                    addTab(createDefenseSkill())
                    setIsAdding(false)
                }}>
                Add defense skill <img src="/Images/stat/stat_defense.webp" alt="defense_icon" />
            </li>
            <li className="input-tab-side-add-option"
                onClick={()=>{
                    addTab(createPassiveSkill())
                    setIsAdding(false)
                }}>
                Add passive skill <img src="/Images/status-effect/Aggro.webp" alt="passive_icon" />
            </li>
            <li className="input-tab-side-add-option"
                onClick={()=>{
                    addTab(createCustomEffect())
                    setIsAdding(false)
                }}>
                Add custom effect <img src="/Images/status-effect/Discard.webp" alt="custom_icon" />
            </li>
            <li className="input-tab-side-add-option"
                onClick={()=>{
                    addTab(createMentalEffect())
                    setIsAdding(false)
                }}>
                    Add mental effect <img src="/Images/Sanity.webp" alt="mental_icon" />
            </li>
        </ul>:<></>}
    </ul>
}