import React, { ReactElement } from "react";
import EgoHeader from "../components/cardHeader/EgoHeader";
import SinCost from "../components/sinCost/SinCost";
import SinResistant from "../components/sinResistant/SinResistant";
import SplashArt from "../components/sinnerSplashArt/SplashArt";
import { IEgoInfo } from "features/cardCreator/types/IEgoInfo";
import { PreviewBodyProps } from "features/cardCreator/editors/CardEditorDefinition";

export default function EgoPreviewBody({ info, skills }: PreviewBodyProps<IEgoInfo>): ReactElement {
    return <>
        {info.splashArt &&
            <div className="ego-splash-art-container">
                <SplashArt variant="ego" splashArt={info.splashArt} splashArtScale={info.splashArtScale} splashArtTranslation={info.splashArtTranslation}/>
            </div>}
        <div className="content-container">
            <div>
                <EgoHeader title={info.title} name={info.name} egoLevel={info.egoLevel} sanityCost={info.sanityCost} sinnerColor={info.sinnerColor}/>
            </div>
            <div className="center-element" style={{ maxHeight: "665px" }}>
                {skills}
                <SinCost sinCost={info.sinCost}/>
            </div>
            <SinResistant sinResistant={info.sinResistant}/>
        </div>
    </>
}
