import React, { forwardRef, useState } from "react";
import { ReactElement } from "react";
import './styles/Card.css'
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import EgoHeader from "./components/cardHeader/EgoHeader";
import SinCost from "./components/sinCost/SinCost";
import SinResistant from "./components/sinResistant/SinResistant";
import SkillDetailContainer from "./components/skillDetailContainer/SkillDetailContainer";
import { reorderSkills } from "features/cardCreator/utils/card/reorderSkills";
import { useAppSelector, useAppDispatch } from "stores/AppStore";
import { egoInfoSlice } from "features/cardCreator/stores/EgoInfoSlice";
import EgoSplashArt from "./components/sinnerSplashArt/EgoSplashArt";


const EgoCard=forwardRef<HTMLDivElement,{changeActiveTab:React.Dispatch<React.SetStateAction<number>>}>(({changeActiveTab},ref):ReactElement=>{
    const [isDragging,setIsDragging] = useState(false)
    const EgoInfoValue = useAppSelector(state => state.egoInfo.value)
    const dispatch = useAppDispatch()

    function moveSkill(fromSkillID:string,toSkillID:string){
        const result = reorderSkills(EgoInfoValue.skillDetails, fromSkillID, toSkillID)
        if(!result) return
        changeActiveTab(i => i > -2 ? result.newIndex : i)
        dispatch(egoInfoSlice.actions.moveSkill({ fromId: fromSkillID, toId: toSkillID }))
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
