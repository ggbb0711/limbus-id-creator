import { useIdInfoContext } from "component/context/IdInfoContext";
import React, { forwardRef, useState } from "react";
import { ReactElement } from "react";
import './styles/Card.css'
import SinnerStats from "./components/SinnerStats/SinnerStats";
import SinnerSplashArt from "./components/SinnerSplashArt/SinnerSplashArt";
import IdHeader from "./components/CardHeader/IdHeader";
import SkillDetailContainer from "./components/SkillDetailContainer/SkillDetailContainer";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"; 
import { isDisabled } from "@testing-library/user-event/dist/utils";


export  const IdCard=forwardRef<HTMLDivElement,{changeActiveTab:(i:number)=>void}>(({changeActiveTab},ref):ReactElement=>{
    const [isDragging,setIsDragging] = useState(false)
    const {idInfoValue}=useIdInfoContext()


    return(
        <TransformWrapper 
        initialScale={0.5}
        minScale={.5}
        maxScale={3}
        limitToBounds={false}
        pinch={{step:10}}
        disabled={isDragging}>
            <TransformComponent>
                <div className="Card" ref={ref}>
                    <div className="sinner-icon-background" style={{"backgroundImage":`url(${idInfoValue.sinnerIcon})`}}></div>
                    <div className="Card-container">
                        <div className="splashArt-container">
                            <SinnerSplashArt/>
                            <SinnerStats />
                        </div>
                        <div className="content-container">
                            <div>
                                <IdHeader/>
                            </div>
                            <div className="center-element" style={{height:"100%"}}>
                                <SkillDetailContainer skillDetails={idInfoValue.skillDetails} draggingHandler={(isDragging)=>setIsDragging(isDragging)} changeActiveTab={changeActiveTab}/>
                            </div> 
                        </div>
                    </div>
                </div>
            </TransformComponent>
        </TransformWrapper>
    )
})