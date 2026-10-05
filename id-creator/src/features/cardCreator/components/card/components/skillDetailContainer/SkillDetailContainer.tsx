import React, { ReactElement, useCallback, useEffect, useRef, useState } from "react";
import "./SkillDetailContainer.css"
import { SkillDetail } from "features/cardCreator/types/SkillDetail";

import DragAndDroppableSkill from "../dragAndDroppableSkill/DragAndDroppableSkill";
import SkillCardSection from "../skillCardSection/SkillCardSection";


export default function SkillDetailContainer({skillDetails,draggingHandler,changeActiveTab,moveSkill}:{
        skillDetails:SkillDetail[],
        draggingHandler:(isDragging:boolean)=>void,
        changeActiveTab:(i:number)=>void,
        moveSkill:(fromSkillID:string,toSkillID:string)=>void
    }):ReactElement{
    const containerRef=useRef<HTMLDivElement>(null)    
    const [currentWidth,setCurrentWidth]=useState(700)
    
    
    const printSinnerSkill = useCallback((skill: SkillDetail): ReactElement => {
        return (
            <DragAndDroppableSkill
                skill={skill}
                dropHandler={(item) => moveSkill(item.skill.inputId, skill.inputId)}
                isDraggingHandler={draggingHandler}
            >
                <SkillCardSection skill={skill}/>
            </DragAndDroppableSkill>
        );
    }, [moveSkill, skillDetails, draggingHandler])

    useEffect(()=>{
        if(containerRef.current){
            let currentColHeight=0
            let colNo=1
            containerRef.current.childNodes.forEach((child:HTMLDivElement)=>{
                currentColHeight+=child.clientHeight
                if(currentColHeight>containerRef.current.clientHeight-5){
                    colNo++
                    currentColHeight=child.clientHeight
                }
                currentColHeight+=25
            })
            setCurrentWidth(colNo*500+(colNo-1)*25)
        }
    },[JSON.stringify(skillDetails)])

    return(
        <div className="skill-detail-container" ref={containerRef} style={{minWidth:Math.max(currentWidth,700)}}>
            {skillDetails.map((skill,i)=>
                <div key={skill.inputId} onClick={()=>changeActiveTab(i)}>
                    {(printSinnerSkill(skill))}
                </div>
            )}
        </div>
    )
}