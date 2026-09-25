import React, { ReactElement } from "react";
import "./SkillEffect.css"

export default function SkillEffect({effect}:{effect:string}):ReactElement{
    
    return(
        <div className="input skill-effect preview" dangerouslySetInnerHTML={{ __html: effect }}>
        </div>
    )
}