import React, { ReactElement } from "react"
import SplashArtTransform from "./SplashArtTransform"
import "./SinnerSplashArt.css"

interface SinnerSplashArtProps {
    splashArt: string
    splashArtScale: number
    splashArtTranslation: {x: number, y: number}
}

export default function SinnerSplashArt({splashArt, splashArtScale, splashArtTranslation}: SinnerSplashArtProps):ReactElement{
    return(
        <div className="sinner-splash-art-container">
            <SplashArtTransform scale={splashArtScale} translation={splashArtTranslation}>
                {splashArt?<img className="splashArtImg" src={splashArt} alt="splashArt" crossOrigin="anonymous" />:<></>}
            </SplashArtTransform>
            <div className="splashArt-container-blur-edges"></div>
        </div>
    )
}
