'use client'
import React, { MouseEvent, ReactElement } from "react";
import "./SkillEffect.css"
import { sanitizeCardHtml } from "utils/htmlUtils";
import { useStatusEffectPopup } from "features/cardCreator/contexts/StatusEffectPopupContext";

export default function SkillEffect({effect}:{effect:string}):ReactElement{
    const { openFromElement } = useStatusEffectPopup()

    function handleClick(e: MouseEvent<HTMLDivElement>) {
        if (openFromElement(e.target)) e.stopPropagation()
    }

    return(
        <div className="input skill-effect preview" onClick={handleClick} dangerouslySetInnerHTML={{ __html: sanitizeCardHtml(effect) }}>
        </div>
    )
}
