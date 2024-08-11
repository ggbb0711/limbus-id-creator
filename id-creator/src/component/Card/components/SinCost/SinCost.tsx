import React, { ReactElement } from "react";
import "./SinCost.css"

interface sinCost{
    wrath_cost:number,
    lust_cost:number,
    sloth_cost:number,
    gluttony_cost:number,
    gloom_cost:number,
    pride_cost:number,
    envy_cost:number,
}

export default function SinCost({sinCost}:{sinCost:sinCost}):ReactElement{
    const {
        wrath_cost,
        lust_cost,
        sloth_cost,
        gluttony_cost,
        gloom_cost,
        pride_cost,
        envy_cost,
    }=sinCost

    function textColor(cost:number){
        return (cost>0)?"#EBC9A8":"#8E8A82"
    }

    return <div className="sin-cost-container">
        <p className="cost-txt">COST</p>
        <div className="center-element sin-cost" style={{color:textColor(wrath_cost)}}>
            <img src="Images/sin-affinity/affinity_Wrath_big.webp" alt="Wrath-cost-icon" />
            <p>{wrath_cost}</p>
        </div>
        <div className="center-element sin-cost" style={{color:textColor(lust_cost)}}>
            <img src="Images/sin-affinity/affinity_Lust_big.webp" alt="Lust-cost-icon" />
            <p>{lust_cost}</p>
        </div>
        <div className="center-element sin-cost" style={{color:textColor(sloth_cost)}}>
            <img src="Images/sin-affinity/affinity_Sloth_big.webp" alt="Sloth-cost-icon" />
            <p>{sloth_cost}</p>
        </div>
        <div className="center-element sin-cost" style={{color:textColor(gluttony_cost)}}>
            <img src="Images/sin-affinity/affinity_Gluttony_big.webp" alt="Gluttony-cost-icon" />
            <p>{gluttony_cost}</p>
        </div>
        <div className="center-element sin-cost" style={{color:textColor(gloom_cost)}}>
            <img src="Images/sin-affinity/affinity_Gloom_big.webp" alt="Gloom-cost-icon" />
            <p>{gloom_cost}</p>
        </div>
        <div className="center-element sin-cost" style={{color:textColor(pride_cost)}}>
            <img src="Images/sin-affinity/affinity_Pride_big.webp" alt="Pride-cost-icon" />
            <p>{pride_cost}</p>
        </div>
        <div className="center-element sin-cost" style={{color:textColor(envy_cost)}}>
            <img src="Images/sin-affinity/affinity_Envy_big.webp" alt="Envy-cost-icon" />
            <p>{envy_cost}</p>
        </div>
    </div>
}