import React, { ReactElement } from "react";
import IdHeader from "../components/cardHeader/IdHeader";
import SplashArt from "../components/sinnerSplashArt/SplashArt";
import SinnerStats from "../components/sinnerStats/SinnerStats";
import { IIdInfo } from "features/cardCreator/types/IIdInfo";
import { PreviewBodyProps } from "features/cardCreator/editors/CardEditorDefinition";

export default function IdPreviewBody({ info, skills }: PreviewBodyProps<IIdInfo>): ReactElement {
    const header = <IdHeader title={info.title} name={info.name} sinnerColor={info.sinnerColor} rarity={info.rarity} traits={info.traits ?? []}/>
    const splashArt = <div className="splashArt-container">
        <SplashArt variant="id" splashArt={info.splashArt} splashArtScale={info.splashArtScale} splashArtTranslation={info.splashArtTranslation}/>
    </div>
    const stats = <SinnerStats minSpeed={info.minSpeed} maxSpeed={info.maxSpeed} hp={info.hp} staggerResist={info.staggerResist} defenseLevel={info.defenseLevel} slashResistant={info.slashResistant} pierceResistant={info.pierceResistant} bluntResistant={info.bluntResistant} sinnerColor={info.sinnerColor}/>

    if (info.cardLayout === "Vertical") {
        const verticalHeader = <div className="vertical-header-block">
            {info.sinnerIcon && <img className="vertical-sinner-icon" src={info.sinnerIcon} alt="" crossOrigin="anonymous"/>}
            {header}
        </div>
        return <>
            {info.splashArt
                ? <div className="vertical-splash">
                    {splashArt}
                    <div className="vertical-header">{verticalHeader}</div>
                </div>
                : <div className="vertical-header-flow">{verticalHeader}</div>}
            <div className="vertical-body">
                {stats}
                {skills}
            </div>
        </>
    }

    return <>
        {info.splashArt && splashArt}
        <div className="content-container">
            <div>{header}</div>
            <div className="skill-area">{skills}</div>
            {stats}
        </div>
    </>
}
