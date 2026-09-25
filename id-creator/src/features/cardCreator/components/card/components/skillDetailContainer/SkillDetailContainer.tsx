import React, { ReactElement, useCallback, useEffect, useRef, useState } from "react";
import "./SkillDetailContainer.css"
import { ICustomEffect } from "features/cardCreator/types/skills/customEffect/ICustomEffect";
import { IDefenseSkill } from "features/cardCreator/types/skills/defenseSkill/IDefenseSkill";
import { IMentalEffect } from "features/cardCreator/types/skills/mentalEffect/IMentalEffect";
import { IOffenseSkill } from "features/cardCreator/types/skills/offenseSkill/IOffenseSkill";
import { IPassiveSkill } from "features/cardCreator/types/skills/passiveSkill/IPassiveSkill";

import DragAndDroppableSkill from "../dragAndDroppableSkill/DragAndDroppableSkill";
import CustomSinnerEffect from "../../sections/customSinnerEffect/CustomSinnerEffect";
import DefenseSinnerSkill from "../../sections/defenseSinnerSkill/DefenseSinnerSkill";
import MentalSinnerEffect from "../../sections/mentalSinnerEffect/MentalSinnerEffect";
import OffenseSinnerSkill from "../../sections/offenseSinnerSkill/OffenseSinnerSkill";
import PassiveSinnerSkill from "../../sections/passiveSinnerSkill/PassiveSinnerSkill";


export default function SkillDetailContainer({skillDetails,draggingHandler,changeActiveTab,moveSkill}:{
        skillDetails:(IOffenseSkill|IDefenseSkill|IPassiveSkill|ICustomEffect|IMentalEffect|never)[],
        draggingHandler:(isDragging:boolean)=>void,
        changeActiveTab:(i:number)=>void,
        moveSkill:(fromSkillID:string,toSkillID:string)=>void
    }):ReactElement{
    const containerRef=useRef<HTMLDivElement>(null)    
    const [currentWidth,setCurrentWidth]=useState(700)
    
    
    const printSinnerSkill = useCallback((
        skill: IOffenseSkill | IDefenseSkill | IPassiveSkill | ICustomEffect | IMentalEffect | never): ReactElement => {
        const skillType = {
            OffenseSkill: <OffenseSinnerSkill offenseSkill={skill as IOffenseSkill} />,
            DefenseSkill: <DefenseSinnerSkill defenseSkill={skill as IDefenseSkill} />,
            PassiveSkill: <PassiveSinnerSkill passiveSkill={skill as IPassiveSkill} />,
            CustomEffect: <CustomSinnerEffect customEffect={skill as ICustomEffect} />,
            MentalEffect: <MentalSinnerEffect mentalEffect={skill as ICustomEffect} />
        };
        return (
            <DragAndDroppableSkill
                skill={skill}
                dropHandler={(item) => moveSkill(item.skill.inputId, skill.inputId)}
                isDraggingHandler={draggingHandler}
            >
                {skillType[skill.type]}
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
            {skillDetails.map((skill:((IOffenseSkill|IDefenseSkill|IPassiveSkill|IMentalEffect|ICustomEffect|never)),i:number)=>
                <div key={skill.inputId} onClick={()=>changeActiveTab(i)}>
                    {(printSinnerSkill(skill))}
                </div>
            )}
        </div>
    )
}