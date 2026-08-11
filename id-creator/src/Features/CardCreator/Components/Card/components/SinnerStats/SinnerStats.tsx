import React from "react";
import { ReactElement } from "react";
import "./SinnerStats.css"
import WarningStrip from "../WarningStrip/WarningStrip";

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

    function changeResistantColor(value:number):string{
        if(value<1) return "var(--Endure)"
        if(value>=1.5) return "var(--Fatal)"

        return"var(--Normal)"
    }

    function changeResistantText(value:number):string{
        if(value<=0.5) return "Ineff"
        if(value<1) return "Endure"
        if(value>=1.5) return "Weak"
        if(value>=2.0) return "Fatal"
        return "Normal"
    }

    return(
        <div className="sinner-stats">
            <WarningStrip color={sinnerColor}/>
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
                    <div className="stat-container-slot">
                        <img className="stat-icon" src="/Images/attack/attackt_slash.webp" alt="attackt_slash" />
                        <div className="stat-content">
                            <div style={{color:changeResistantColor(slashResistant)}}>
                            <p>{changeResistantText(slashResistant)}</p>
                            <p>[x{slashResistant}]</p>
                            </div>
                        </div>
                    </div>
                    <div className="stat-container-slot">
                        <img className="stat-icon" src="/Images/attack/attackt_pierce.webp" alt="attackt_pierce" />
                        <div className="stat-content">
                            <div style={{color:changeResistantColor(pierceResistant)}}>
                                <p>{changeResistantText(pierceResistant)}</p>
                                <p>[x{pierceResistant}]</p>
                            </div>
                        </div>
                    </div>
                    <div className="stat-container-slot">
                        <img className="stat-icon" src="/Images/attack/attackt_blunt.webp" alt="attackt_blunt" />
                        <div className="stat-content">
                            <div style={{color:changeResistantColor(bluntResistant)}}>
                                <p>{changeResistantText(bluntResistant)}</p>
                                <p>[x{bluntResistant}]</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
