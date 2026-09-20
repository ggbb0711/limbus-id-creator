import React, { ReactElement } from "react";
import "./SinCost.css"

interface sinCost{
    wrath:number,
    lust:number,
    sloth:number,
    gluttony:number,
    gloom:number,
    pride:number,
    envy:number,
}

export default function SinCost({sinCost}:{sinCost:sinCost}):ReactElement{
    const {
        wrath,
        lust,
        sloth,
        gluttony,
        gloom,
        pride,
        envy,
    }=sinCost

    function textColor(cost:number){
        return (cost>0)?"#EBC9A8":"#8E8A82"
    }

    return <div className="sin-cost-container">
        <p className="cost-txt">COST</p>
        <div className="center-element sin-cost" style={{color:textColor(wrath)}}>
            <img src="/Images/sin-affinity/affinity_Wrath_big.webp" alt="Wrath-cost-icon" />
            <p>{wrath}</p>
        </div>
        <div className="center-element sin-cost" style={{color:textColor(lust)}}>
            <img src="/Images/sin-affinity/affinity_Lust_big.webp" alt="Lust-cost-icon" />
            <p>{lust}</p>
        </div>
        <div className="center-element sin-cost" style={{color:textColor(sloth)}}>
            <img src="/Images/sin-affinity/affinity_Sloth_big.webp" alt="Sloth-cost-icon" />
            <p>{sloth}</p>
        </div>
        <div className="center-element sin-cost" style={{color:textColor(gluttony)}}>
            <img src="/Images/sin-affinity/affinity_Gluttony_big.webp" alt="Gluttony-cost-icon" />
            <p>{gluttony}</p>
        </div>
        <div className="center-element sin-cost" style={{color:textColor(gloom)}}>
            <img src="/Images/sin-affinity/affinity_Gloom_big.webp" alt="Gloom-cost-icon" />
            <p>{gloom}</p>
        </div>
        <div className="center-element sin-cost" style={{color:textColor(pride)}}>
            <img src="/Images/sin-affinity/affinity_Pride_big.webp" alt="Pride-cost-icon" />
            <p>{pride}</p>
        </div>
        <div className="center-element sin-cost" style={{color:textColor(envy)}}>
            <img src="/Images/sin-affinity/affinity_Envy_big.webp" alt="Envy-cost-icon" />
            <p>{envy}</p>
        </div>
    </div>
}