import { useIdInfoContext } from "component/context/IdInfoContext";
import SkillEffect from "component/IdCard/components/SkillEffect/SkillEffect";
import { ICustomEffect } from "Interfaces/CustomEffect/ICustomEffect";
import React, { ReactElement } from "react";
import "../SinnerSkill.css"
import "./CustomSinnerEffect.css"

export default function CustomSinnerEffect({skillIndex,preview}:{skillIndex:number,preview?:boolean}):ReactElement{
    const {idInfoValue}=useIdInfoContext()
    
    const{
        name,
        customImg,
        effectColor,
        effect,
    }=(idInfoValue.skillDetails[skillIndex] as ICustomEffect)


    return(
        <div className="skill-section-container custom-effect-container" style={{zIndex:idInfoValue.skillDetails.length-skillIndex+1}}>
            <div className="skill-section">
                <div>
                    <div style={{color:effectColor}} className="cutom-effect-header">
                        {customImg?<img className={`custom-img`} src={customImg} alt="custom_icon" />:<></>}
                        <p className="custom-effect-title">{name}</p>
                    </div>
                    <div>
                        <SkillEffect effect={effect} preview={preview}/>
                    </div>
                </div>

            </div>
        </div>
    )
}