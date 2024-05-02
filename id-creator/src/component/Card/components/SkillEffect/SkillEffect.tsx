import React, { ReactElement, useRef } from "react";
import "./SkillEffect.css"
import ContentEditable from "react-contenteditable";

export default function SkillEffect({effect}:{effect:string}):ReactElement{
    const contentEditableRef=useRef<HTMLElement>(null)
    
    return(
        <ContentEditable
            className={`input skill-effect preview`}
            innerRef={contentEditableRef}
            disabled={true}
            html={effect}
            onChange={(e)=>{}}
            />
    )
}