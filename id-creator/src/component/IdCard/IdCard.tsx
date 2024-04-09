import { useIdInfoContext } from "component/context/IdInfoContext";
import React, { forwardRef, useEffect, useRef } from "react";
import { ReactElement } from "react";
import './styles/IdCard.css'
import SinnerStats from "./components/SinnerStats/SinnerStats";
import { usePreviewContext } from "component/context/PreviewContext";
import SinnerSplashArt from "./components/SinnerSplashArt/SinnerSplashArt";
import IdHeader from "./components/IdHeader/IdHeader";
import SkillDetailContainer from "./components/SkillDetailContainer/SkillDetailContainer";


export  const IdCard=forwardRef<HTMLDivElement>((props,ref):ReactElement=>{
    const {idInfoValue}=useIdInfoContext()
    const {preview,setPreview} = usePreviewContext()


    useEffect(()=>{
        setPreview(!preview)
        setPreview(preview)
    },[idInfoValue.skillDetails])


    return(
        <div className="idCard" ref={ref}>
            <div className="sinner-icon-background" style={{"backgroundImage":`url(${idInfoValue.sinnerIcon})`}}></div>
            <div className="idCard-container">
                <div className="splashArt-container">
                    <SinnerSplashArt/>
                    <SinnerStats />
                </div>
                <div className="content-container">
                    <div>
                        <IdHeader/>
                    </div> 
                    <SkillDetailContainer/>
                </div>
            </div>
        </div>
    )
})