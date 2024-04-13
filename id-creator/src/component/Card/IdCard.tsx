import { useIdInfoContext } from "component/context/IdInfoContext";
import React, { forwardRef } from "react";
import { ReactElement } from "react";
import './styles/Card.css'
import SinnerStats from "./components/SinnerStats/SinnerStats";
import SinnerSplashArt from "./components/SinnerSplashArt/SinnerSplashArt";
import IdHeader from "./components/CardHeader/IdHeader";
import SkillDetailContainer from "./components/SkillDetailContainer/SkillDetailContainer";


export  const IdCard=forwardRef<HTMLDivElement>((props,ref):ReactElement=>{
    const {idInfoValue}=useIdInfoContext()

    return(
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
                        <SkillDetailContainer skillDetails={idInfoValue.skillDetails}/>
                    </div> 
                </div>
            </div>
        </div>
    )
})