import { getResistTier } from "features/cardCreator/utils/card/getResistTier";
import React, { useId } from "react";
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

const BORDER_HEIGHT = 14
const TEXT_WIDTH = 84
const TILE_WIDTH = 96

function ResistSlot({ icon, alt, value }: { icon: string, alt: string, value: number }): ReactElement {
    const tier = getResistTier(value)
    return <div className="stat-container-slot">
        <img className="stat-icon" src={icon} alt={alt} />
        <div className="stat-content" style={{ color: tier.color }}>
            <p>{tier.label}</p>
            <p>[x{value}]</p>
        </div>
    </div>
}

export default function SinnerStats({minSpeed, maxSpeed, hp, staggerResist, defenseLevel, slashResistant, pierceResistant, bluntResistant, sinnerColor}: SinnerStatsProps):ReactElement{
    const patternId = `warning-pattern-${useId().replace(/:/g, "")}`
    return(
        <div className="sinner-stats">
            <div className="sinner-stats-border" style={{color:sinnerColor}} aria-hidden="true">
                <svg width="100%" height={BORDER_HEIGHT}>
                    <defs>
                        <pattern id={patternId} patternUnits="userSpaceOnUse" width={TILE_WIDTH} height={BORDER_HEIGHT}>
                            <text x={0} y={11} fontSize={12} textLength={TEXT_WIDTH} lengthAdjust="spacingAndGlyphs" fill="currentColor" stroke="black" strokeWidth={0.5}>WARNING ////</text>
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill={`url(#${patternId})`} />
                </svg>
            </div>
            <div className="stat-container">
                <div className="stat-container-slot">
                    <img className="stat-icon" src="/Images/stat/stat_speed.webp" alt="Speed" />
                    <div className="stat-content"><p>{minSpeed} - {maxSpeed}</p></div>
                </div>
                <div className="stat-container-slot">
                    <img className="stat-icon" src="/Images/stat/stat_hp.webp" alt="HP" />
                    <div className="stat-content"><p>{hp}</p></div>
                </div>
                <div className="stat-container-slot">
                    <img className="stat-icon" src="/Images/stat/stat_def.webp" alt="Defense level" />
                    <div className="stat-content"><p>{defenseLevel}</p></div>
                </div>
                <div className="stat-container-slot stagger-threshold-container">
                    <div className="stat-content">
                        <p>Stagger Threshold</p>
                        <p>{staggerResist}</p>
                    </div>
                </div>
                <ResistSlot icon="/Images/attack/attackt_Slash.webp" alt="Slash resistance" value={slashResistant}/>
                <ResistSlot icon="/Images/attack/attackt_Pierce.webp" alt="Pierce resistance" value={pierceResistant}/>
                <ResistSlot icon="/Images/attack/attackt_Blunt.webp" alt="Blunt resistance" value={bluntResistant}/>
            </div>
        </div>
    )
}
