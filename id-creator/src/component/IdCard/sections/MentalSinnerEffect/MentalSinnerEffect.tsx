import { useIdInfoContext } from "component/context/IdInfoContext";
import SkillEffect from "component/IdCard/components/SkillEffect/SkillEffect";
import SkillTitle from "component/IdCard/components/SkillTitle/SkillTitle";
import useSkillInput from "component/IdCard/util/useSkillInput";
import { IMentalEffect } from "Interfaces/MentalEffect/IMentalEffect";
import React, { ReactElement } from "react";
import "../SinnerSkill.css"
import "./MentalSinnerEffect.css"

export default function MentalSinnerEffect({skillIndex,preview}:{skillIndex:number,preview:boolean}):ReactElement{
    const {idInfoValue}=useIdInfoContext()
    const {onChangeInput}=useSkillInput(skillIndex)
    const {effect}=(idInfoValue.skillDetails[skillIndex] as IMentalEffect)
    
    return(
        <div className="skill-section-container">
            <p className="skill-label">SANITY</p>
            <div className="skill-section">
                <div>
                    <img className="sanity-img" src="Images/Sanity.png" alt="sanity-icon" />
                </div>
                <div>
                    <div className="mental-skill-header">
                        <SkillTitle skillAffinity="None" skillTitle={"Sanity Effects"} preview={true}/>
                    </div>
                    <div>
                        <SkillEffect effect={effect} preview={preview} onInputChange={onChangeInput("effect")}/>
                    </div>
                </div>
            </div>
        </div>
    )
}