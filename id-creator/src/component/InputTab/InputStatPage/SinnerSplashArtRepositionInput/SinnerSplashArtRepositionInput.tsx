import React, { ReactElement } from "react";
import {MapInteractionCSS} from "react-map-interaction"
import "./SinnerSplashArtRepositionInput.css"

export default function SinnerSplashArtRepositionInput({scale,translation,onChange}:{scale:number,translation:{
    x:number,
    y:number,
},onChange:(value:{scale:number,translation:{x:number,y:number}})=>void}):ReactElement{
    return(
        <div className="sinner-splash-art-reposition-container">
            <MapInteractionCSS value={{scale,translation}} onChange={onChange}>
            </MapInteractionCSS>
        </div>
    )
}