import React, { ReactElement } from "react";
import "./CardHeader.css"

interface EgoHeaderProps {
    title: string
    name: string
    egoLevel: string
    sanityCost: number
    sinnerColor: string
}

function egoLevelImg(egoLevel:string){
    switch(egoLevel){
        case "ZAYIN": return "/Images/ego-level/ZAYIN_Level.webp"
        case "HE": return "/Images/ego-level/HE_Level.webp"
        case "TETH": return "/Images/ego-level/TETH_Level.webp"
        case "WAW": return "/Images/ego-level/WAW_Level.webp"
        case "ALEPH": return "/Images/ego-level/ALEPH_Level.webp"
        case "UNDEFINED": return "/Images/ego-level/undef.webp"
    }
}

export default function EgoHeader({title, name, egoLevel, sanityCost, sinnerColor}: EgoHeaderProps):ReactElement{
    return(
        <div className="header-container">
            <div className="center-element">
                <div className="title-field" style={{background:sinnerColor}}>
                    <p>{title}</p>
                </div>
                <img className="ego-level-icon" src={egoLevelImg(egoLevel)} alt={`${egoLevel}-level-icon`} />

            </div>

            <div className="center-element">
                <div className="name-field" style={{background:sinnerColor}}>
                    <p>{name}</p>
                </div>
                <div className="center-element sanity-cost-container">
                    <img className="sanity-cost-img" src="/Images/Sanity.webp" alt="sanity-cost-icon" />
                    <p>Sanity cost </p>
                    <p className="sanity-cost">{sanityCost}</p>
                </div>
            </div>
        </div>
    )
}
