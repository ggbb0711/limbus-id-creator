import { useIdInfoContext } from "component/context/IdInfoContext";
import React, { forwardRef, useCallback, useEffect, useMemo, useState } from "react";
import { ReactElement } from "react";
import './styles/Card.css'
import SinnerStats from "./components/SinnerStats/SinnerStats";
import SinnerSplashArt from "./components/SinnerSplashArt/SinnerSplashArt";
import IdHeader from "./components/CardHeader/IdHeader";
import SkillDetailContainer from "./components/SkillDetailContainer/SkillDetailContainer";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"; 
import { ICustomEffect } from "Interfaces/CustomEffect/ICustomEffect";
import { IDefenseSkill } from "Interfaces/DefenseSkill/IDefenseSkill";
import { IMentalEffect } from "Interfaces/MentalEffect/IMentalEffect";
import { IOffenseSkill } from "Interfaces/OffenseSkill/IOffenseSkill";
import { IPassiveSkill } from "Interfaces/PassiveSkill/IPassiveSkill";


export  const IdCard=forwardRef<HTMLDivElement,{changeActiveTab:(i:number)=>void}>(({changeActiveTab},ref):ReactElement=>{
    const [isDragging,setIsDragging] = useState(false)
    const {idInfoValue,setIdInfoValue}=useIdInfoContext()


    function moveSkill(fromSkillID:string,toSkillID:string){
        //Do nothing if they are the same id
        if(fromSkillID!=toSkillID){
            const newSkillDetails = [...idInfoValue.skillDetails]
            let skill;
            let skillIndex=-1
            // //Find and delete the fromSkill
            for(let i=0;i<newSkillDetails.length;i++){
                if(newSkillDetails[i].inputId===fromSkillID){
                    skill=newSkillDetails[i]
                    skillIndex=i
                    newSkillDetails.splice(i,1)
                    break;
                }
            }
            if(skill){
                for(let k=0;k<newSkillDetails.length;k++){
                    if(newSkillDetails[k].inputId===toSkillID){
                        if(skillIndex<=k)newSkillDetails.splice(k+1,0,skill)
                        else newSkillDetails.splice(k,0,skill)
                        break;
                    }
                }
            }
            setIdInfoValue((oldIdInfoValue)=> ({...oldIdInfoValue,skillDetails:newSkillDetails}))
        }
    }


    return(
        <TransformWrapper 
        initialScale={0.5}
        minScale={.5}
        maxScale={3}
        limitToBounds={false}
        pinch={{step:10}}
        disabled={isDragging}>
            <TransformComponent>
                <div className="Card" ref={ref}>
                    <div className="sinner-icon-background" style={{"backgroundImage":`url(${idInfoValue.sinnerIcon})`}}></div>
                    <div className="Card-container">
                        <div className="splashArt-container">
                            <SinnerSplashArt/>
                            <SinnerStats />
                        </div>
                        <div className="content-container">
                            <div>
                                <IdHeader/>
                            </div>
                            <div className="center-element" style={{height:"100%"}}>
                                <SkillDetailContainer moveSkill={moveSkill} skillDetails={idInfoValue.skillDetails} draggingHandler={(isDragging)=>setIsDragging(isDragging)} changeActiveTab={changeActiveTab}/>
                            </div> 
                        </div>
                    </div>
                </div>
            </TransformComponent>
        </TransformWrapper>
    )
})