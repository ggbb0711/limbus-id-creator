import React from "react";
import SplashArtTransform from "./SplashArtTransform"
import "./EgoSplashArt.css"

interface EgoSplashArtProps {
    splashArt: string
    splashArtScale: number
    splashArtTranslation: {x: number, y: number}
}

export default function EgoSplashArt({splashArt, splashArtScale, splashArtTranslation}: EgoSplashArtProps){
    return(
        <div className="ego-splash-art">
            <SplashArtTransform scale={splashArtScale} translation={splashArtTranslation}>
                {splashArt?<img className="egoSplashArtImg" src={splashArt} alt="egoSplashArtImg" crossOrigin="anonymous" />:<></>}
            </SplashArtTransform>
        </div>
    )
}