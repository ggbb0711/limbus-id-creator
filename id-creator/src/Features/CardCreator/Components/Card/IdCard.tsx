import React, { forwardRef, useState } from "react";
import { ReactElement } from "react";
import './styles/Card.css'
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import IdHeader from "./components/CardHeader/IdHeader";
import SinnerSplashArt from "./components/SinnerSplashArt/SinnerSplashArt";
import SinnerStats from "./components/SinnerStats/SinnerStats";
import SkillDetailContainer from "./components/SkillDetailContainer/SkillDetailContainer";
import { useAppSelector, useAppDispatch } from "Stores/AppStore";
import { setIdInfo } from "Features/CardCreator/Stores/IdInfoSlice";


const IdCard=forwardRef<HTMLDivElement,{changeActiveTab:React.Dispatch<React.SetStateAction<number>>}>(({changeActiveTab},ref):ReactElement=>{
    const [isDragging,setIsDragging] = useState(false)
    const idInfoValue = useAppSelector(state => state.idInfo.value)
    const dispatch = useAppDispatch()


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
            dispatch(setIdInfo({...idInfoValue,skillDetails:newSkillDetails}))
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
            <TransformComponent wrapperStyle={{width:"100vw"}}>
                <div className="Card" ref={ref}>
                    {idInfoValue.sinnerIcon && <img className="sinner-icon-background" src={idInfoValue.sinnerIcon} alt="sinner-icon" crossOrigin="anonymous" />}
                    <div className="Card-container">
                        <div className="splashArt-container">
                            <SinnerSplashArt splashArt={idInfoValue.splashArt} splashArtScale={idInfoValue.splashArtScale} splashArtTranslation={idInfoValue.splashArtTranslation}/>
                            <SinnerStats minSpeed={idInfoValue.minSpeed} maxSpeed={idInfoValue.maxSpeed} hp={idInfoValue.hp} staggerResist={idInfoValue.staggerResist} defenseLevel={idInfoValue.defenseLevel} slashResistant={idInfoValue.slashResistant} pierceResistant={idInfoValue.pierceResistant} bluntResistant={idInfoValue.bluntResistant} sinnerColor={idInfoValue.sinnerColor}/>
                        </div>
                        <div className="content-container">
                            <div>
                                <IdHeader title={idInfoValue.title} name={idInfoValue.name} sinnerColor={idInfoValue.sinnerColor} rarity={idInfoValue.rarity} traits={idInfoValue.traits ?? []}/>
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

IdCard.displayName = "IdCard"

export {
    IdCard
}
