import React, { ReactElement, useRef } from "react";
import "./SkillTitle.css"
import ContentEditable from "react-contenteditable";

export default function SkillTitle({skillAffinity,skillTitle,preview,onInputChange}:{skillAffinity:string,skillTitle:string,preview?:boolean,onInputChange?:(e:React.ChangeEvent<HTMLInputElement>)=>void}):ReactElement{
    const contentEditableRef=useRef(null)
    
    return(
        <div className="skill-title-container" style={{backgroundImage:`linear-gradient(75deg, var(--${skillAffinity}-title-shadow) 90%, transparent 90%)`}}>
            <div className="skill-title-block" style={{"backgroundImage":`
            linear-gradient(110deg, var(--${skillAffinity}) 70%, 
                transparent 72%, var(--${skillAffinity}) 72%, 
                var(--${skillAffinity}) 74%, transparent 74%, 
                transparent 76%, var(--${skillAffinity}) 76%, 
                var(--${skillAffinity}) 78%, transparent 78%, 
                transparent 80%, var(--${skillAffinity}) 80%, 
                var(--${skillAffinity}) 82%, transparent 82%)
            `}}>
                <ContentEditable
                    className={`input ${preview?"preview":""}`}
                    innerRef={contentEditableRef}
                    disabled={preview}
                    html={skillTitle}
                    onChange={onInputChange}/>
            </div>
            
        </div>
    )
}