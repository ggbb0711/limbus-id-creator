import React, { forwardRef, useState } from "react";
import { ReactElement } from "react";
import './styles/Card.css'
import IdHeader from "./components/cardHeader/IdHeader";
import SplashArt from "./components/sinnerSplashArt/SplashArt";
import SinnerStats from "./components/sinnerStats/SinnerStats";
import SkillDetailContainer from "./components/skillDetailContainer/SkillDetailContainer";
import CardZoomShell from "./components/cardZoomShell/CardZoomShell";
import { useAppSelector } from "stores/AppStore";
import { useMoveSkill } from "features/cardCreator/hooks/useMoveSkill";

const IdCard = forwardRef<HTMLDivElement, { changeActiveTab: React.Dispatch<React.SetStateAction<number>> }>(({ changeActiveTab }, ref): ReactElement => {
    const [isDragging, setIsDragging] = useState(false)
    const idInfoValue = useAppSelector(state => state.idInfo.value)
    const moveSkill = useMoveSkill(changeActiveTab)

    return (
        <CardZoomShell isDragging={isDragging}>
            <div className="Card" ref={ref}>
                {idInfoValue.sinnerIcon && <img className="sinner-icon-background" src={idInfoValue.sinnerIcon} alt="sinner-icon" crossOrigin="anonymous" />}
                <div className="Card-container">
                    <div className="splashArt-container">
                        <SplashArt variant="id" splashArt={idInfoValue.splashArt} splashArtScale={idInfoValue.splashArtScale} splashArtTranslation={idInfoValue.splashArtTranslation}/>
                        <SinnerStats minSpeed={idInfoValue.minSpeed} maxSpeed={idInfoValue.maxSpeed} hp={idInfoValue.hp} staggerResist={idInfoValue.staggerResist} defenseLevel={idInfoValue.defenseLevel} slashResistant={idInfoValue.slashResistant} pierceResistant={idInfoValue.pierceResistant} bluntResistant={idInfoValue.bluntResistant} sinnerColor={idInfoValue.sinnerColor}/>
                    </div>
                    <div className="content-container">
                        <div>
                            <IdHeader title={idInfoValue.title} name={idInfoValue.name} sinnerColor={idInfoValue.sinnerColor} rarity={idInfoValue.rarity} traits={idInfoValue.traits ?? []}/>
                        </div>
                        <div className="center-element" style={{ height: "100%" }}>
                            <SkillDetailContainer moveSkill={moveSkill} skillDetails={idInfoValue.skillDetails} draggingHandler={setIsDragging} changeActiveTab={changeActiveTab}/>
                        </div>
                    </div>
                </div>
            </div>
        </CardZoomShell>
    )
})

IdCard.displayName = "IdCard"

export {
    IdCard
}
