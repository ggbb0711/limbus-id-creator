import React, { useEffect } from "react"
import { useState } from "react"
import {MapInteractionCSS} from "react-map-interaction"
import "./ViewImagePopUp.css"
import Arrow_up_icon from "Icons/Arrow_up_icon"
import Arrow_down_icon from "Icons/Arrow_down_icon"
import Close_icon from "Icons/Close_icon"


export default function ViewImagePopUp({images,index=0,isActive,closeFn}:{images:string[],index:number,isActive:boolean,closeFn:()=>void}){
    const [currChoice,setCurrChoice] = useState(index)
    
    useEffect(()=>{setCurrChoice(index)},[index])

    return <>
        {isActive?<div className="image-pop-up-container">
            <MapInteractionCSS>
                {images.map((image,i)=><img key={i} src={image} alt="view-img" className={`image-pop-up ${i!=currChoice?"hidden":""}`} />)}
            </MapInteractionCSS>
            <div className="image-pop-up-close" onClick={()=>{
                    setCurrChoice(index)
                    closeFn()
                }}>
            <Close_icon/>
            </div>
            {currChoice>0?<div className="image-pop-up-arrow left" onClick={()=>setCurrChoice(currChoice-1)}>
                <Arrow_down_icon/>
            </div>:<></>}
            {currChoice<images.length-1?<div className="image-pop-up-arrow right" onClick={()=>setCurrChoice(currChoice+1)}>
                <Arrow_up_icon/>
            </div>:<></>}
        </div>
        :<></>}
    </>
}