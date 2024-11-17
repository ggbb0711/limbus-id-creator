import { useEgoInfoContext } from "component/context/EgoInfoContext";
import React from "react";
import {MapInteractionCSS} from "react-map-interaction"
import "./EgoSplashArt.css"


export default function EgoSplashArt(){
    const {EgoInfoValue}=useEgoInfoContext()

    const {splashArt,splashArtScale,splashArtTranslation}=EgoInfoValue
    return(
        <div className="ego-splash-art">
            <MapInteractionCSS disableZoom={true} disablePan={true} value={{scale:splashArtScale,translation:splashArtTranslation}}>
                {splashArt?<img className="egoSplashArtImg" src={splashArt} alt="egoSplashArtImg" />:<></>}
            </MapInteractionCSS>
        </div>
    )
}