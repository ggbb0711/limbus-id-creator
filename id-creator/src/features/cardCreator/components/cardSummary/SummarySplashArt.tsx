'use client'
import React, { ReactElement, useState } from "react";
import SplashArt from "features/cardCreator/components/card/components/sinnerSplashArt/SplashArt";
import ImageViewer from "components/ui/imageViewer/ImageViewer";
import { useCarouselIndex } from "hooks/useCarouselIndex";
import { ISplashArtTranslation } from "features/cardCreator/types/ICardInfoBase";

interface SummarySplashArtProps {
    kind: "Identity" | "Ego"
    name: string
    splashArt: string
    splashArtScale: number
    splashArtTranslation: ISplashArtTranslation
}

export default function SummarySplashArt({ kind, name, splashArt, splashArtScale, splashArtTranslation }: SummarySplashArtProps): ReactElement {
    const [isViewing, setIsViewing] = useState(false)
    const carousel = useCarouselIndex(1)

    return <div className="card-summary-splash-below">
        <button type="button" className={`card-summary-splash-button ${kind === "Ego" ? "ego" : ""}`} aria-label="View splash art" onClick={() => setIsViewing(true)}>
            {kind === "Ego"
                ? <span className="card-summary-ego-circle">
                    <SplashArt variant="ego" alt={`${name} splash art`} splashArt={splashArt} splashArtScale={splashArtScale} splashArtTranslation={splashArtTranslation}/>
                </span>
                : <img className="card-summary-splash-art" src={splashArt} alt={`${name} splash art`}/>}
        </button>
        {isViewing && <ImageViewer images={[splashArt]} title={`${name} splash art`} carousel={carousel} onClose={() => setIsViewing(false)}/>}
    </div>
}
