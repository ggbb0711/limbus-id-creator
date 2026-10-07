import React, { ReactElement } from "react"
import SplashArtTransform from "./SplashArtTransform"
import "./SinnerSplashArt.css"
import "./EgoSplashArt.css"
import { ISplashArtTranslation } from "features/cardCreator/types/ICardInfoBase"

const VARIANTS = {
    id: { container: "sinner-splash-art-container", image: "splashArtImg", alt: "splashArt", blurEdges: true },
    ego: { container: "ego-splash-art", image: "egoSplashArtImg", alt: "egoSplashArtImg", blurEdges: false },
} as const

interface SplashArtProps {
    variant: keyof typeof VARIANTS
    splashArt: string
    splashArtScale: number
    splashArtTranslation: ISplashArtTranslation
}

export default function SplashArt({ variant, splashArt, splashArtScale, splashArtTranslation }: SplashArtProps): ReactElement {
    const classes = VARIANTS[variant]
    return (
        <div className={classes.container}>
            <SplashArtTransform scale={splashArtScale} translation={splashArtTranslation}>
                {splashArt && <img className={classes.image} src={splashArt} alt={classes.alt} crossOrigin="anonymous" />}
            </SplashArtTransform>
            {classes.blurEdges && <div className="splashArt-container-blur-edges"></div>}
        </div>
    )
}
