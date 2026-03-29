import React, { forwardRef, useState } from "react";
import { ReactElement } from "react";
import './styles/Card.css'
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import EgoHeader from "./components/CardHeader/EgoHeader";
import EgoSplashArt from "./components/EgoSplashArt/EgoSplashArt";
import SinCost from "./components/SinCost/SinCost";
import SinResistant from "./components/SinResistant/SinResistant";
import SkillDetailContainer from "./components/SkillDetailContainer/SkillDetailContainer";
import { useAppSelector, useAppDispatch } from "Stores/AppStore";
import { setEgoInfo } from "Features/CardCreator/Stores/EgoInfoSlice";


const EgoCard=forwardRef<HTMLDivElement,{changeActiveTab:React.Dispatch<React.SetStateAction<number>>}>(({changeActiveTab},ref):ReactElement=>{
    const [isDragging,setIsDragging] = useState(false)
    const EgoInfoValue = useAppSelector(state => state.egoInfo.value)
    const dispatch = useAppDispatch()

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
            dispatch(setEgoInfo({...EgoInfoValue,skillDetails:newSkillDetails}))
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
                    {EgoInfoValue.sinnerIcon && <img className="sinner-icon-background" src={EgoInfoValue.sinnerIcon} alt="sinner-icon" crossOrigin="anonymous" />}
                    <div className="Card-container">
                        {EgoInfoValue.splashArt?
                        <div className="ego-splash-art-container">
                            <EgoSplashArt splashArt={EgoInfoValue.splashArt} splashArtScale={EgoInfoValue.splashArtScale} splashArtTranslation={EgoInfoValue.splashArtTranslation}/>
                        </div>:<></>}

                        <div className="content-container">
                            <div>
                                <EgoHeader title={EgoInfoValue.title} name={EgoInfoValue.name} egoLevel={EgoInfoValue.egoLevel} sanityCost={EgoInfoValue.sanityCost} sinnerColor={EgoInfoValue.sinnerColor}/>
                            </div>
                            <div className="center-element" style={{maxHeight:"665px"}}>
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


EgoCard.displayName = "EgoCard"

export {
    EgoCard
}
