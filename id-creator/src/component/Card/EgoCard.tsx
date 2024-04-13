import React, { forwardRef } from "react";
import { ReactElement } from "react";
import './styles/Card.css'
import SkillDetailContainer from "./components/SkillDetailContainer/SkillDetailContainer";
import { useEgoInfoContext } from "component/context/EgoInfoContext";
import EgoHeader from "./components/CardHeader/EgoHeader";
import SinCost from "./components/SinCost/SinCost";
import SinResistant from "./components/SinResistant/SinResistant";
import EgoSplashArt from "./components/EgoSplashArt/EgoSplashArt";


export  const EgoCard=forwardRef<HTMLDivElement>((props,ref):ReactElement=>{
    const {EgoInfoValue}=useEgoInfoContext()

    return(
        <div className="Card" ref={ref}>
            <div className="sinner-icon-background" style={{"backgroundImage":`url(${EgoInfoValue.sinnerIcon})`}}></div>
            <div className="Card-container">
                {/* {EgoInfoValue.splashArt?                
                <div className="ego-splash-art-container">
                    <EgoSplashArt/>
                </div>:<></>} */}

                <div className="content-container">
                    <div>
                        <EgoHeader/>
                    </div> 
                    <div className="center-element">
                        <SkillDetailContainer skillDetails={EgoInfoValue.skillDetails}/>
                        <SinCost sinCost={EgoInfoValue.sinCost}/>
                    </div>
                    <SinResistant sinResistant={EgoInfoValue.sinResistant}/>
                </div>
            </div>
        </div>
    )
})