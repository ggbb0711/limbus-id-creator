import React, { ReactElement } from "react";
import "./SkillEffect.css"
import { sanitizeCardHtml } from "utils/sanitizeHtml";

export default function SkillEffect({effect}:{effect:string}):ReactElement{
    
    return(
        <div className="input skill-effect preview" dangerouslySetInnerHTML={{ __html: sanitizeCardHtml(effect) }}>
        </div>
    )
}