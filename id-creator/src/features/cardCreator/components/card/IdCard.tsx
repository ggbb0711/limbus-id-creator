import React, { forwardRef, useState } from "react";
import { ReactElement } from "react";
import './styles/Card.css'
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import IdHeader from "./components/cardHeader/IdHeader";
import SinnerSplashArt from "./components/sinnerSplashArt/SinnerSplashArt";
import SinnerStats from "./components/sinnerStats/SinnerStats";
import SkillDetailContainer from "./components/skillDetailContainer/SkillDetailContainer";
import { reorderSkills } from "features/cardCreator/utils/card/reorderSkills";
import { useAppSelector, useAppDispatch } from "stores/AppStore";
import { idInfoSlice } from "features/cardCreator/stores/IdInfoSlice";


const IdCard=forwardRef<HTMLDivElement,{changeActiveTab:React.Dispatch<React.SetStateAction<number>>}>(({changeActiveTab},ref):ReactElement=>{
    const [isDragging,setIsDragging] = useState(false)
    const idInfoValue = useAppSelector(state => state.idInfo.value)
    const dispatch = useAppDispatch()


    function moveSkill(fromSkillID:string,toSkillID:string){
        const result = reorderSkills(idInfoValue.skillDetails, fromSkillID, toSkillID)
        if(!result) return
        changeActiveTab(i => i > -2 ? result.newIndex : i)
        dispatch(idInfoSlice.actions.moveSkill({ fromId: fromSkillID, toId: toSkillID }))
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
