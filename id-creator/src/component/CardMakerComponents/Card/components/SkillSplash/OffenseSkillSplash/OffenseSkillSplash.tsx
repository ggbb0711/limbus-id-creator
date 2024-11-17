import React, { ReactElement } from "react";
import "../SkillSplash.css"

export default function OffenseSkillSplash({skillAffinity,skillImage}:{skillAffinity:string,skillImage?:string}):ReactElement{
    return(
        <div className="skill-splash">
            <img src={`Images/skill-frame/${skillAffinity}Frame.png`} alt={skillAffinity+"Frame"} className={`sin-frame ${skillAffinity==="None"?"none-affinity":""}`} />
            <div className="splash-container" style={{'backgroundColor':`var(--${skillAffinity})`}}>
                {
                (skillImage)?
                    <img className="skill-image" src={skillImage} alt="skill image" />:
                    (skillAffinity!=="None")?<img className={`placeholder-skill`} src={`Images/sin-affinity/affinity_${skillAffinity}_big.webp`} alt="skill affinity" />:<></>
                }
            </div>
        </div>
    )
}