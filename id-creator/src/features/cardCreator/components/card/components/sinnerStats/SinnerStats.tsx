import { getResistTier } from "features/cardCreator/utils/card/getResistTier";
import React from "react";
import { ReactElement } from "react";
import "./SinnerStats.css"

interface SinnerStatsProps {
    minSpeed: number
    maxSpeed: number
    hp: number
    staggerResist: string
    defenseLevel: number
    slashResistant: number
    pierceResistant: number
    bluntResistant: number
    sinnerColor: string
}

export default function SinnerStats({minSpeed, maxSpeed, hp, staggerResist, defenseLevel, slashResistant, pierceResistant, bluntResistant, sinnerColor}: SinnerStatsProps):ReactElement{

    function generateSinnerStatsBorder(){
        const borderText = []
        for(let i=0;i<9;i++){
            borderText.push(<span key={i}>WARNING ////</span>)
        }
        return borderText
    }

    return(
        <div className="sinner-stats">
            <div className="sinner-stats-border" style={{color:sinnerColor}}>
                {generateSinnerStatsBorder()}
            </div>
            <div className="sinner-stats-container">
                <div className="stat-container">
                    <div className="stat-container-slot">
                        <img className="stat-icon" src="/Images/stat/stat_speed.webp" alt="speed_icon" />
                        <div className="stat-content">
                            <p>{minSpeed} - {maxSpeed}</p>
                        </div>
                    </div>
                    <div className="stat-container-slot">
                        <img className="stat-icon" src="/Images/stat/stat_hp.webp" alt="hp_icon" />
                        <div className="stat-content">
                            <p>{hp}</p>
                        </div>
                    </div>
                    <div className="stat-container-slot">
                        <img className="stat-icon" src="/Images/stat/stat_def.webp" alt="def_icon" />
                        <div className="stat-content">
                            <p>{defenseLevel}</p>
                        </div>
                    </div>
                    <div className="stat-container-slot stagger-threshold-container">
                        <div className="stat-content">
                            <p>Stagger Threshold</p>
                            <p>{staggerResist}</p>
                        </div>
                    </div>
                </div>
                <div className="stat-container">
                    <div className="stat-container-slot">
                        <img className="stat-icon" src="/Images/attack/attackt_Slash.webp" alt="attackt_slash" />
                        <div className="stat-content">
                            <div style={{color:getResistTier(slashResistant).color}}>
                            <p>{getResistTier(slashResistant).label}</p>
                            <p>[x{slashResistant}]</p>
                            </div>
                        </div>
                    </div>
                    <div className="stat-container-slot">
                        <img className="stat-icon" src="/Images/attack/attackt_Pierce.webp" alt="attackt_pierce" />
                        <div className="stat-content">
                            <div style={{color:getResistTier(pierceResistant).color}}>
                                <p>{getResistTier(pierceResistant).label}</p>
                                <p>[x{pierceResistant}]</p>
                            </div>
                        </div>
                    </div>
                    <div className="stat-container-slot">
                        <img className="stat-icon" src="/Images/attack/attackt_Blunt.webp" alt="attackt_blunt" />
                        <div className="stat-content">
                            <div style={{color:getResistTier(bluntResistant).color}}>
                                <p>{getResistTier(bluntResistant).label}</p>
                                <p>[x{bluntResistant}]</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="sinner-stats-border" style={{color:sinnerColor}}>
                {generateSinnerStatsBorder()}
            </div>
        </div>
    )
}
