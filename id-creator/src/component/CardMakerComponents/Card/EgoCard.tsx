import React, { forwardRef, useState } from "react";
import { ReactElement } from "react";
import './styles/Card.css'
import SkillDetailContainer from "./components/SkillDetailContainer/SkillDetailContainer";
import { useEgoInfoContext } from "component/context/EgoInfoContext";
import EgoHeader from "./components/CardHeader/EgoHeader";
import SinCost from "./components/SinCost/SinCost";
import SinResistant from "./components/SinResistant/SinResistant";
import EgoSplashArt from "./components/EgoSplashArt/EgoSplashArt";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";


export  const EgoCard=forwardRef<HTMLDivElement,{changeActiveTab:React.Dispatch<React.SetStateAction<number>>}>(({changeActiveTab},ref):ReactElement=>{
    const [isDragging,setIsDragging] = useState(false)
    const {EgoInfoValue,setEgoInfoValue}=useEgoInfoContext()

    function moveSkill(fromSkillID:string,toSkillID:string){
        //Do nothing if they are the same id
        if(fromSkillID!=toSkillID){
            const newSkillDetails = [...EgoInfoValue.skillDetails]
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
                        const replacingIndex = (skillIndex<=k)?k+1:k
                        newSkillDetails.splice(replacingIndex,0,skill)
                        changeActiveTab((i)=>{
                            if(i>-2) return replacingIndex
                            return i
                        })
                        break;
                    }
                }
            }
            setEgoInfoValue((oldIdInfoValue)=> ({...oldIdInfoValue,skillDetails:newSkillDetails}))
        }
    }

    return(
        <TransformWrapper
        initialScale={0.5}
        minScale={.1}
        limitToBounds={false}
        pinch={{step:10}}
        disabled={isDragging}
        initialPositionX={400}
        initialPositionY={60}
        doubleClick={{
            disabled:true
        }}>
            {/* I don't understand why but the width for ego doesn't expand to the whole screen */}
            <TransformComponent wrapperStyle={{width:"100vw"}}>
                <div className="Card" ref={ref}>
                    <div className="sinner-icon-background" style={{"backgroundImage":`url(${EgoInfoValue.sinnerIcon})`}}></div>
                    <div className="Card-container">
                        {EgoInfoValue.splashArt?                
                        <div className="ego-splash-art-container">
                            <EgoSplashArt/>
                        </div>:<></>}

                        <div className="content-container">
                            <div>
                                <EgoHeader/>
                            </div> 
                            <div className="center-element">
                                <SkillDetailContainer  moveSkill={moveSkill} skillDetails={EgoInfoValue.skillDetails} draggingHandler={(isDragging)=>setIsDragging(isDragging)} changeActiveTab={changeActiveTab}/>
                                <SinCost sinCost={EgoInfoValue.sinCost}/>
                            </div>
                            <SinResistant sinResistant={EgoInfoValue.sinResistant}/>
                        </div>
                    </div>
                </div>
            </TransformComponent>
        </TransformWrapper>
    )
})
