import React, { ReactElement } from "react";
import IdHeader from "../components/cardHeader/IdHeader";
import SplashArt from "../components/sinnerSplashArt/SplashArt";
import SinnerStats from "../components/sinnerStats/SinnerStats";
import { IIdInfo } from "features/cardCreator/types/IIdInfo";
import { PreviewBodyProps } from "features/cardCreator/editors/CardEditorDefinition";

export default function IdPreviewBody({ info, skills }: PreviewBodyProps<IIdInfo>): ReactElement {
    return <>
        <div className="splashArt-container">
            <SplashArt variant="id" splashArt={info.splashArt} splashArtScale={info.splashArtScale} splashArtTranslation={info.splashArtTranslation}/>
            <SinnerStats minSpeed={info.minSpeed} maxSpeed={info.maxSpeed} hp={info.hp} staggerResist={info.staggerResist} defenseLevel={info.defenseLevel} slashResistant={info.slashResistant} pierceResistant={info.pierceResistant} bluntResistant={info.bluntResistant} sinnerColor={info.sinnerColor}/>
        </div>
        <div className="content-container">
            <div>
                <IdHeader title={info.title} name={info.name} sinnerColor={info.sinnerColor} rarity={info.rarity} traits={info.traits ?? []}/>
            </div>
            <div className="center-element" style={{ height: "100%" }}>
                {skills}
            </div>
        </div>
    </>
}
