import React, { ReactElement } from "react";
import "./SinCost.css"

interface sinCost{
    Wrath_cost:number,
    Lust_cost:number,
    Sloth_cost:number,
    Gluttony_cost:number,
    Gloom_cost:number,
    Pride_cost:number,
    Envy_cost:number,
}

export default function SinCost({sinCost}:{sinCost:sinCost}):ReactElement{
    const {
        Wrath_cost,
        Lust_cost,
        Sloth_cost,
        Gluttony_cost,
        Gloom_cost,
        Pride_cost,
        Envy_cost,
    }=sinCost

    function textColor(cost:number){
        return (cost>0)?"#EBC9A8":"#8E8A82"
    }

    return <div className="sin-cost-container">
        <p className="cost-txt">COST</p>
        <div className="center-element sin-cost" style={{color:textColor(Wrath_cost)}}>
            <img src="Images/sin-affinity/affinity_Wrath_big.webp" alt="Wrath-cost-icon" />
            <p>{Wrath_cost}</p>
        </div>
        <div className="center-element sin-cost" style={{color:textColor(Lust_cost)}}>
            <img src="Images/sin-affinity/affinity_Lust_big.webp" alt="Lust-cost-icon" />
            <p>{Lust_cost}</p>
        </div>
        <div className="center-element sin-cost" style={{color:textColor(Sloth_cost)}}>
            <img src="Images/sin-affinity/affinity_Sloth_big.webp" alt="Sloth-cost-icon" />
            <p>{Sloth_cost}</p>
        </div>
        <div className="center-element sin-cost" style={{color:textColor(Gluttony_cost)}}>
            <img src="Images/sin-affinity/affinity_Gluttony_big.webp" alt="Gluttony-cost-icon" />
            <p>{Gluttony_cost}</p>
        </div>
        <div className="center-element sin-cost" style={{color:textColor(Gloom_cost)}}>
            <img src="Images/sin-affinity/affinity_Gloom_big.webp" alt="Gloom-cost-icon" />
            <p>{Gloom_cost}</p>
        </div>
        <div className="center-element sin-cost" style={{color:textColor(Pride_cost)}}>
            <img src="Images/sin-affinity/affinity_Pride_big.webp" alt="Pride-cost-icon" />
            <p>{Pride_cost}</p>
        </div>
        <div className="center-element sin-cost" style={{color:textColor(Envy_cost)}}>
            <img src="Images/sin-affinity/affinity_Envy_big.webp" alt="Envy-cost-icon" />
            <p>{Envy_cost}</p>
        </div>
    </div>
}