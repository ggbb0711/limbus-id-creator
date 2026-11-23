import React, { ReactElement } from "react"
import SplashArtTransform from "./SplashArtTransform"
import "./SinnerSplashArt.css"
import "./EgoSplashArt.css"
import { ISplashArtTranslation } from "features/cardCreator/types/ICardInfoBase"

const VARIANTS = {
    id: { container: "sinner-splash-art-container", image: "splashArtImg", alt: "Splash art", blurEdges: true },
    ego: { container: "ego-splash-art", image: "egoSplashArtImg", alt: "E.G.O splash art", blurEdges: false },
} as const

interface SplashArtProps {
    variant: keyof typeof VARIANTS
    alt?: string
    splashArt: string
    splashArtScale: number
    splashArtTranslation: ISplashArtTranslation
}

export default function SplashArt({ variant, alt, splashArt, splashArtScale, splashArtTranslation }: SplashArtProps): ReactElement {
    const classes = VARIANTS[variant]
    return (
        <div className={classes.container}>
            <SplashArtTransform scale={splashArtScale} translation={splashArtTranslation}>
                {splashArt && <img className={classes.image} src={splashArt} alt={alt ?? classes.alt} crossOrigin="anonymous" />}
            </SplashArtTransform>
            {classes.blurEdges && <div className="splashArt-container-blur-edges"></div>}
        </div>
    )
}
