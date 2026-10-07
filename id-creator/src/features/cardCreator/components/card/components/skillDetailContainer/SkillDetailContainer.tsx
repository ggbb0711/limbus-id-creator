import React, { ReactElement, useCallback, useEffect, useRef, useState } from "react";
import { computeColumns } from "features/cardCreator/utils/layout/computeColumns";
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
        const container = containerRef.current
        if(!container) return
        const heights = Array.from(container.children, child => (child as HTMLElement).clientHeight)
        setCurrentWidth(computeColumns(heights, container.clientHeight).width)
    },[skillDetails])

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