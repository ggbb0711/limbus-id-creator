import React, { ReactElement, useEffect, useRef, useState } from "react";
import "./SkillDetailContainer.css"
import { ICustomEffect } from "Interfaces/CustomEffect/ICustomEffect";
import { IDefenseSkill } from "Interfaces/DefenseSkill/IDefenseSkill";
import { IMentalEffect } from "Interfaces/MentalEffect/IMentalEffect";
import { IOffenseSkill } from "Interfaces/OffenseSkill/IOffenseSkill";
import { IPassiveSkill } from "Interfaces/PassiveSkill/IPassiveSkill";
import CustomSinnerEffect from "component/Card/sections/CustomSinnerEffect/CustomSinnerEffect";
import DefenseSinnerSkill from "component/Card/sections/DefenseSinnerSkill/DefenseSinnerSkill";
import MentalSinnerEffect from "component/Card/sections/MentalSinnerEffect/MentalSinnerEffect";
import OffenseSinnerSkill from "component/Card/sections/OffenseSinnerSkill/OffenseSinnerSkill";
import PassiveSinnerSkill from "component/Card/sections/PassiveSinnerSkill/PassiveSinnerSkill";


export default function SkillDetailContainer({skillDetails}:{skillDetails:(IOffenseSkill|IDefenseSkill|IPassiveSkill|ICustomEffect|IMentalEffect|never)[]}):ReactElement{
    const containerRef=useRef<HTMLDivElement>(null)    
    const [currentWidth,setCurrentWidth]=useState(700)
    
    
    function printSinnerSkill(skill:((IOffenseSkill|IDefenseSkill|IPassiveSkill|ICustomEffect|IMentalEffect|never))):ReactElement{
        
        const skillType={
            OffenseSkill:<OffenseSinnerSkill key={skill.inputId} offenseSkill={skill as IOffenseSkill}/>,
            DefenseSkill:<DefenseSinnerSkill key={skill.inputId} defenseSkill={skill as IDefenseSkill}/>,
            PassiveSkill:<PassiveSinnerSkill key={skill.inputId} passiveSkill={skill as IPassiveSkill} />,
            CustomEffect:<CustomSinnerEffect key={skill.inputId} customEffect={skill as ICustomEffect} />,
            MentalEffect:<MentalSinnerEffect key={skill.inputId} mentalEffect={skill as ICustomEffect} />
        }
        return skillType[skill.type]
    }

    //For some reason the div doesn't expan when the children wrap
    //So i have to manually expand it
    useEffect(()=>{
        if(containerRef.current){
            let currentColHeight=0
            let colNo=1
            containerRef.current.childNodes.forEach((child:HTMLDivElement)=>{
                currentColHeight+=child.clientHeight
                //Move on to the next col
                if(currentColHeight>containerRef.current.clientHeight-25){
                    colNo++
                    currentColHeight=child.clientHeight
                }
                else{
                    //Add gap
                    currentColHeight+=25
                }
            })
            setCurrentWidth(colNo*450+(colNo-1)*25)
        }
    },[JSON.stringify(skillDetails)])

    return(
        <div className="skill-detail-container" ref={containerRef} style={{minWidth:Math.max(currentWidth,700)}}>
            {skillDetails.map((skill:((IOffenseSkill|IDefenseSkill|IPassiveSkill|IMentalEffect|ICustomEffect|never)),i:number)=>
                printSinnerSkill(skill)
            )}
        </div>
    )
}