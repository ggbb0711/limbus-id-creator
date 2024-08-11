import React, { useState } from "react";
import "./PostCarousel.css"
import ViewImagePopUp from "component/ViewImagePopUp/ViewImagePopUp";
import Arrow_up_icon from "Icons/Arrow_up_icon";
import Arrow_down_icon from "Icons/Arrow_down_icon";

export default function PostCarousel({postImages}:{postImages:string[]}){
    const [currImg,setCurrImg] = useState(0)
    const [isViewModeActive,setIsViewModeActive] = useState(false)
    
    return <div className="post-carousel-container">
        {currImg>0?<div className="post-carousel-arrow left" onClick={()=>setCurrImg(currImg-1)}>
            <Arrow_down_icon/>
        </div>
        :<></>}
        {postImages.map((image,i)=><img key={i} className={`post-img ${i!=currImg?"hidden":""}`} src={image} alt="card-img" onClick={()=>{
                setIsViewModeActive(true)
            }}/>)}
        <ViewImagePopUp images={postImages} index={currImg} isActive={isViewModeActive} closeFn={()=>{
                setIsViewModeActive(false)
            }}/>
        {currImg<postImages.length-1?<div className="post-carousel-arrow right" onClick={()=>setCurrImg(currImg+1)}>
            <Arrow_up_icon/>
        </div>
        :<></>}
        
    </div>
}