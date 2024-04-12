import React, { ReactElement, useRef } from "react";
import "./SkillEffect.css"
import ContentEditable from "react-contenteditable";

export default function SkillEffect({effect,preview}:{effect:string,preview:boolean}):ReactElement{
    const contentEditableRef=useRef<HTMLElement>(null)
    
    return(
        <ContentEditable
            className={`input ${preview?"preview":""}`}
            innerRef={contentEditableRef}
            html={effect}
            disabled={preview}
            onChange={(e)=>{}}/>
    )
}