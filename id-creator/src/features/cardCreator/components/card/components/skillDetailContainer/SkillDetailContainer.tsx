import React, { ReactElement, useCallback, useEffect, useRef, useState } from "react";
import { computeColumns } from "features/cardCreator/utils/layout/computeColumns";
import "./SkillDetailContainer.css"
import { SkillDetail } from "features/cardCreator/types/SkillDetail";
import { CardLayout } from "features/cardCreator/constants";
import { SkillActions } from "features/cardCreator/hooks/useSkillActions";
import { SkillContextMenu } from "features/cardCreator/components/skillActionsMenu/SkillActionsMenu";

import DragAndDroppableSkill from "../dragAndDroppableSkill/DragAndDroppableSkill";
import SkillCardSection from "../skillCardSection/SkillCardSection";


export default function SkillDetailContainer({skillDetails,draggingHandler,changeActiveTab,skillActions,layout="Horizontal",cardHeight}:{
        skillDetails:SkillDetail[],
        draggingHandler:(isDragging:boolean)=>void,
        changeActiveTab:(i:number)=>void,
        skillActions:SkillActions,
        layout?:CardLayout,
        cardHeight?:number
    }):ReactElement{
    const isVertical = layout === "Vertical"
    const containerRef=useRef<HTMLDivElement>(null)    
    const [currentWidth,setCurrentWidth]=useState(700)
    
    
    const printSinnerSkill = useCallback((skill: SkillDetail): ReactElement => {
        return (
            <DragAndDroppableSkill
                skill={skill}
                dropHandler={(item) => skillActions.moveSkill(item.skill.inputId, skill.inputId)}
                isDraggingHandler={draggingHandler}
            >
                <SkillCardSection skill={skill}/>
            </DragAndDroppableSkill>
        );
    }, [skillActions, draggingHandler])

    useEffect(()=>{
        const container = containerRef.current
        if(!container || isVertical) return
        const measure = () => {
            const heights = Array.from(container.children, child => (child as HTMLElement).clientHeight)
            setCurrentWidth(computeColumns(heights, container.clientHeight).width)
        }
        measure()
        const observer = new ResizeObserver(measure)
        observer.observe(container)
        Array.from(container.children).forEach(child => observer.observe(child))
        return () => observer.disconnect()
    },[skillDetails, isVertical, cardHeight])

    return(
        <div className={`skill-detail-container ${isVertical ? "vertical" : ""}`} ref={containerRef} style={isVertical ? undefined : {width:Math.max(currentWidth,700)}}>
            {skillDetails.map((skill,i)=>
                <SkillContextMenu key={skill.inputId} {...skillActions.actionsFor(i)}>
                    <div className="skill-context-trigger" onClick={()=>changeActiveTab(i)}>
                        {(printSinnerSkill(skill))}
                    </div>
                </SkillContextMenu>
            )}
        </div>
    )
}