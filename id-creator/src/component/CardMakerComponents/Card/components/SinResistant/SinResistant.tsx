import { ReactElement } from "react";
import "./SinResistant.css"
import React from "react";

interface sinResistant{
    wrath_resistant:number;
    lust_resistant:number;
    sloth_resistant:number;
    gluttony_resistant:number;
    gloom_resistant:number;
    pride_resistant:number;
    envy_resistant:number;
}


export default function SinResistant({sinResistant}:{sinResistant:sinResistant}):ReactElement{
    const {
        wrath_resistant,
        lust_resistant,
        sloth_resistant,
        gluttony_resistant,
        gloom_resistant,
        pride_resistant,
        envy_resistant,
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
        <div className="sin-resistant" style={{color:changeResistantColor(wrath_resistant)}}>
            <img src="Images/sin-affinity/affinity_Wrath_big.webp" alt="Wrath-resistant-icon" />
            <div>
                <p>{changeResistantText(wrath_resistant)}</p>
                <p>[x{wrath_resistant}]</p>
            </div>
        </div>
        <div className="sin-resistant" style={{color:changeResistantColor(lust_resistant)}}>
            <img src="Images/sin-affinity/affinity_Lust_big.webp" alt="Lust-resistant-icon" />
            <div>
                <p>{changeResistantText(lust_resistant)}</p>
                <p>[x{lust_resistant}]</p>
            </div>        
        </div>
        <div className="sin-resistant" style={{color:changeResistantColor(sloth_resistant)}}>
            <img src="Images/sin-affinity/affinity_Sloth_big.webp" alt="Sloth-resistant-icon" />
            <div>
                <p>{changeResistantText(sloth_resistant)}</p>
                <p>[x{sloth_resistant}]</p>
            </div>
        </div>
        <div className="sin-resistant" style={{color:changeResistantColor(gluttony_resistant)}}>
            <img src="Images/sin-affinity/affinity_Gluttony_big.webp" alt="Gluttony-resistant-icon" />
            <div>
                <p>{changeResistantText(gluttony_resistant)}</p>
                <p>[x{gluttony_resistant}]</p>
            </div>
        </div>
        <div className="sin-resistant" style={{color:changeResistantColor(gloom_resistant)}}>
            <img src="Images/sin-affinity/affinity_Gloom_big.webp" alt="Gloom-resistant-icon" />
            <div>
                <p>{changeResistantText(gloom_resistant)}</p>
                <p>[x{gloom_resistant}]</p>
            </div>
        </div>
        <div className="sin-resistant" style={{color:changeResistantColor(pride_resistant)}}>
            <img src="Images/sin-affinity/affinity_Pride_big.webp" alt="Pride-resistant-icon" />
            <div>
                <p>{changeResistantText(pride_resistant)}</p>
                <p>[x{pride_resistant}]</p>
            </div>
        </div>
        <div className="sin-resistant" style={{color:changeResistantColor(envy_resistant)}}>
            <img src="Images/sin-affinity/affinity_Envy_big.webp" alt="Envy-resistant-icon" />
            <div>
                <p>{changeResistantText(envy_resistant)}</p>
                <p>[x{envy_resistant}]</p>
            </div>        
        </div>
    </div>
}