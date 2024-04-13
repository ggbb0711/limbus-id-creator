import React, { ReactElement } from "react"
import "../SkillSplash.css"
import "./DefenseSkillSplash.css"

export default function DefenseSkillSplash({skillAffinity,skillImage,defenseType}:{skillAffinity:string,skillImage?:string,defenseType:string}):ReactElement{
    return(
        <div className="skill-splash">
            <img src={`Images/skill-frame/${skillAffinity}Frame.png`} alt={skillAffinity+"Frame"} className={`sin-frame ${skillAffinity==="None"?"none-affinity":""}`} />
            <div className="splash-container" style={{'backgroundColor':`var(--${skillAffinity})`}}>
                <div className="defense-icon-container">
                        <img src={`Images/defense/defense_${defenseType}.png`} alt={`defense_${defenseType}`} />
                </div>
                {
                skillImage?
                    <img className="skill-image" src={skillImage} alt="skill image" />:
                    <></>
                }
            </div>
        </div>
    )
}