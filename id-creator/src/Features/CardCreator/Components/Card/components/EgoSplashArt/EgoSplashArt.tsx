import React from "react";
import {MapInteractionCSS} from "react-map-interaction"
import "./EgoSplashArt.css"

interface EgoSplashArtProps {
    splashArt: string
    splashArtScale: number
    splashArtTranslation: {x: number, y: number}
}

export default function EgoSplashArt({splashArt, splashArtScale, splashArtTranslation}: EgoSplashArtProps){
    return(
        <div className="ego-splash-art">
            <MapInteractionCSS disableZoom={true} disablePan={true} value={{scale:splashArtScale,translation:splashArtTranslation}}>
                {splashArt?<img className="egoSplashArtImg" src={splashArt} alt="egoSplashArtImg" crossOrigin="anonymous" />:<></>}
            </MapInteractionCSS>
        </div>
    )
}
