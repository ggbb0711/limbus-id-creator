import React, { ReactElement, useRef } from "react";
import "./SkillEffect.css"
import ContentEditable from "react-contenteditable";

export default function SkillEffect({effect,preview,onInputChange}:{effect:string,preview:boolean,onInputChange?:(e:React.ChangeEvent<HTMLInputElement>)=>void}):ReactElement{
    const contentEditableRef=useRef<HTMLElement>(null)
    
    return(
        <ContentEditable
            className={`input ${preview?"preview":""}`}
            innerRef={contentEditableRef}
            html={effect}
            disabled={preview}
            onChange={onInputChange}/>
    )
}