import React, { ReactElement } from "react";
import "../SinnerSkill.css"
import "./PassiveSinnerSkill.css"
import { IPassiveSkill } from "Interfaces/PassiveSkill/IPassiveSkill";
import useSkillInput from "component/IdCard/util/useSkillInput";
import { useIdInfoContext } from "component/context/IdInfoContext";
import SkillEffect from "component/IdCard/components/SkillEffect/SkillEffect";
import SkillTitle from "component/IdCard/components/SkillTitle/SkillTitle";

export default function PassiveSinnerSkill({skillIndex,preview}:{skillIndex:number,preview:boolean}):ReactElement{
    const {idInfoValue}=useIdInfoContext()
    const {onChangeInput}=useSkillInput(skillIndex)
    const {
        skillLabel,
        name,
        skillEffect,
        affinity,
        req,
        reqNo}=(idInfoValue.skillDetails[skillIndex] as IPassiveSkill)


    return(
        <div className="skill-section-container" style={{zIndex:idInfoValue.skillDetails.length-skillIndex+1}}>
            <p className="skill-label">{skillLabel}</p>
            <div className="skill-section">
                <div>
                    <div className="skill-title-req">
                        <div className="active-skill-title">
                            <SkillTitle skillAffinity={"None"} skillTitle={name} onInputChange={onChangeInput("name")} preview={preview}/>
                        </div>
                        
                        <div className="req-container">
                            <p className={`${req==="None"?"hidden":""}`}>{req}: {reqNo}</p><img className={`req-sin-icon ${affinity==="None"||req==="None"?"hidden":""}`} src={`Images/sin-affinity/affinity_${affinity}_big.webp`}/>
                        </div>
                    </div>
                    <div className="skill-description">
                        <SkillEffect effect={skillEffect} preview={preview} onInputChange={onChangeInput("skillEffect")}/>
                    </div>
                </div>
                
            </div>
        </div>
    )
}