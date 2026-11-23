import React, { ReactElement } from "react";
import EgoHeader from "../components/cardHeader/EgoHeader";
import SinCost from "../components/sinCost/SinCost";
import SinResistant from "../components/sinResistant/SinResistant";
import SplashArt from "../components/sinnerSplashArt/SplashArt";
import { IEgoInfo } from "features/cardCreator/types/IEgoInfo";
import { PreviewBodyProps } from "features/cardCreator/editors/CardEditorDefinition";

export default function EgoPreviewBody({ info, skills }: PreviewBodyProps<IEgoInfo>): ReactElement {
    const header = <EgoHeader title={info.title} name={info.name} egoLevel={info.egoLevel} sanityCost={info.sanityCost} sinnerColor={info.sinnerColor}/>
    const splashArt = <SplashArt variant="ego" splashArt={info.splashArt} splashArtScale={info.splashArtScale} splashArtTranslation={info.splashArtTranslation}/>

    if (info.cardLayout === "Vertical") {
        const verticalHeader = <div className="vertical-header-block">
            {info.sinnerIcon && <img className="vertical-sinner-icon" src={info.sinnerIcon} alt="" crossOrigin="anonymous"/>}
            {header}
        </div>
        return <>
            {info.splashArt
                ? <div className="ego-vertical-top">
                    {splashArt}
                    <div className="vertical-header">{verticalHeader}</div>
                </div>
                : <div className="vertical-header-flow">{verticalHeader}</div>}
            <div className="vertical-body">
                <div className="ego-vertical-row">
                    {skills}
                    <SinCost sinCost={info.sinCost}/>
                </div>
                <SinResistant sinResistant={info.sinResistant}/>
            </div>
        </>
    }

    return <>
        {info.splashArt &&
            <div className="ego-splash-art-container">
                {splashArt}
            </div>
        }
        <div className="content-container">
            <div>{header}</div>
            <div className="skill-area ego-skill-area">
                {skills}
                <SinCost sinCost={info.sinCost}/>
            </div>
            <SinResistant sinResistant={info.sinResistant}/>
        </div>
    </>
}
