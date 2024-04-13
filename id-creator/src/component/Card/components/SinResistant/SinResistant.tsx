import { ReactElement } from "react";
import "./SinResistant.css"
import React from "react";

interface sinResistant{
    Wrath_resistant:number;
    Lust_resistant:number;
    Sloth_resistant:number;
    Gluttony_resistant:number;
    Gloom_resistant:number;
    Pride_resistant:number;
    Envy_resistant:number;
}


export default function SinResistant({sinResistant}:{sinResistant:sinResistant}):ReactElement{
    const {
        Wrath_resistant,
        Lust_resistant,
        Sloth_resistant,
        Gluttony_resistant,
        Gloom_resistant,
        Pride_resistant,
        Envy_resistant,
    }=sinResistant

    function changeResistantColor(value:number):string{
        if(value<=0.75) return "var(--Endure)"
        if(value>=2.0) return "var(--Fatal)"
        
        return"var(--Normal)"
    }

    function changeResistantText(value:number):string{
        if(value<=0.5) return "Ineff"
        if(value<=0.75) return "Endure"
        if(value>=2.0) return "Fatal"
        return "Normal"
    }
    
    return <div className="sin-resistant-container">
        <div className="sin-resistant" style={{color:changeResistantColor(Wrath_resistant)}}>
            <img src="Images/sin-affinity/affinity_Wrath_big.webp" alt="Wrath-resistant-icon" />
            <div>
                <p>{changeResistantText(Wrath_resistant)}</p>
                <p>[x{Wrath_resistant}]</p>
            </div>
        </div>
        <div className="sin-resistant" style={{color:changeResistantColor(Lust_resistant)}}>
            <img src="Images/sin-affinity/affinity_Lust_big.webp" alt="Lust-resistant-icon" />
            <div>
                <p>{changeResistantText(Lust_resistant)}</p>
                <p>[x{Lust_resistant}]</p>
            </div>        
        </div>
        <div className="sin-resistant" style={{color:changeResistantColor(Sloth_resistant)}}>
            <img src="Images/sin-affinity/affinity_Sloth_big.webp" alt="Sloth-resistant-icon" />
            <div>
                <p>{changeResistantText(Sloth_resistant)}</p>
                <p>[x{Sloth_resistant}]</p>
            </div>
        </div>
        <div className="sin-resistant" style={{color:changeResistantColor(Gluttony_resistant)}}>
            <img src="Images/sin-affinity/affinity_Gluttony_big.webp" alt="Gluttony-resistant-icon" />
            <div>
                <p>{changeResistantText(Gluttony_resistant)}</p>
                <p>[x{Gluttony_resistant}]</p>
            </div>
        </div>
        <div className="sin-resistant" style={{color:changeResistantColor(Gloom_resistant)}}>
            <img src="Images/sin-affinity/affinity_Gloom_big.webp" alt="Gloom-resistant-icon" />
            <div>
                <p>{changeResistantText(Gloom_resistant)}</p>
                <p>[x{Gloom_resistant}]</p>
            </div>
        </div>
        <div className="sin-resistant" style={{color:changeResistantColor(Pride_resistant)}}>
            <img src="Images/sin-affinity/affinity_Pride_big.webp" alt="Pride-resistant-icon" />
            <div>
                <p>{changeResistantText(Pride_resistant)}</p>
                <p>[x{Pride_resistant}]</p>
            </div>
        </div>
        <div className="sin-resistant" style={{color:changeResistantColor(Envy_resistant)}}>
            <img src="Images/sin-affinity/affinity_Envy_big.webp" alt="Envy-resistant-icon" />
            <div>
                <p>{changeResistantText(Envy_resistant)}</p>
                <p>[x{Envy_resistant}]</p>
            </div>        
        </div>
    </div>
}