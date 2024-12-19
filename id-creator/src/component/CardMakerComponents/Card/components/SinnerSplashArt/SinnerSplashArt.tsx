import { useIdInfoContext } from "component/context/IdInfoContext"
import React, { ReactElement } from "react"
import {MapInteractionCSS} from "react-map-interaction"
import "./SinnerSplashArt.css"

export default function SinnerSplashArt():ReactElement{
    const {idInfoValue}=useIdInfoContext()

    const {splashArt,splashArtScale,splashArtTranslation}=idInfoValue
    return(
        <div className="sinner-splash-art-container">
            <MapInteractionCSS disableZoom={true} disablePan={true} value={{scale:splashArtScale,translation:splashArtTranslation}}>
                {splashArt?<img className="splashArtImg" src={splashArt} alt="splashArt" />:<></>}
            </MapInteractionCSS>
        </div>
    )
}