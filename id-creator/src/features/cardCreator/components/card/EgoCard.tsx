import React, { forwardRef, useState } from "react";
import { ReactElement } from "react";
import './styles/Card.css'
import EgoHeader from "./components/cardHeader/EgoHeader";
import SinCost from "./components/sinCost/SinCost";
import SinResistant from "./components/sinResistant/SinResistant";
import SkillDetailContainer from "./components/skillDetailContainer/SkillDetailContainer";
import SplashArt from "./components/sinnerSplashArt/SplashArt";
import CardZoomShell from "./components/cardZoomShell/CardZoomShell";
import { useAppSelector } from "stores/AppStore";
import { useMoveSkill } from "features/cardCreator/hooks/useMoveSkill";

const EgoCard = forwardRef<HTMLDivElement, { changeActiveTab: React.Dispatch<React.SetStateAction<number>> }>(({ changeActiveTab }, ref): ReactElement => {
    const [isDragging, setIsDragging] = useState(false)
    const egoInfoValue = useAppSelector(state => state.egoInfo.value)
    const moveSkill = useMoveSkill(changeActiveTab)

    return (
        <CardZoomShell isDragging={isDragging}>
            <div className="Card" ref={ref}>
                {egoInfoValue.sinnerIcon && <img className="sinner-icon-background" src={egoInfoValue.sinnerIcon} alt="sinner-icon" crossOrigin="anonymous" />}
                <div className="Card-container">
                    {egoInfoValue.splashArt &&
                        <div className="ego-splash-art-container">
                            <SplashArt variant="ego" splashArt={egoInfoValue.splashArt} splashArtScale={egoInfoValue.splashArtScale} splashArtTranslation={egoInfoValue.splashArtTranslation}/>
                        </div>}
                    <div className="content-container">
                        <div>
                            <EgoHeader title={egoInfoValue.title} name={egoInfoValue.name} egoLevel={egoInfoValue.egoLevel} sanityCost={egoInfoValue.sanityCost} sinnerColor={egoInfoValue.sinnerColor}/>
                        </div>
                        <div className="center-element" style={{ maxHeight: "665px" }}>
                            <SkillDetailContainer moveSkill={moveSkill} skillDetails={egoInfoValue.skillDetails} draggingHandler={setIsDragging} changeActiveTab={changeActiveTab}/>
                            <SinCost sinCost={egoInfoValue.sinCost}/>
                        </div>
                        <SinResistant sinResistant={egoInfoValue.sinResistant}/>
                    </div>
                </div>
            </div>
        </CardZoomShell>
    )
})

EgoCard.displayName = "EgoCard"

export {
    EgoCard
}
