import { ReactElement } from "react";
import "./SinResistant.css"
import React from "react";

interface sinResistant{
    wrath:number;
    lust:number;
    sloth:number;
    gluttony:number;
    gloom:number;
    pride:number;
    envy:number;
}


export default function SinResistant({sinResistant}:{sinResistant:sinResistant}):ReactElement{
    const {
        wrath,
        lust,
        sloth,
        gluttony,
        gloom,
        pride,
        envy,
    }=sinResistant

    function changeResistantColor(value:number):string{
        if(value<1) return "var(--Endure)"
        if(value>=2.0) return "var(--Fatal)"

        return"var(--Normal)"
    }

    function changeResistantText(value:number):string{
        if(value<=0.5) return "Ineff"
        if(value<1) return "Endure"
        if(value>=2.0) return "Fatal"
        return "Normal"
    }

    return <div className="sin-resistant-container">
        <div className="sin-resistant" style={{color:changeResistantColor(wrath)}}>
            <img src="/Images/sin-affinity/affinity_Wrath_big.webp" alt="Wrath-resistant-icon" />
            <div>
                <p>{changeResistantText(wrath)}</p>
                <p>[x{wrath}]</p>
            </div>
        </div>
        <div className="sin-resistant" style={{color:changeResistantColor(lust)}}>
            <img src="/Images/sin-affinity/affinity_Lust_big.webp" alt="Lust-resistant-icon" />
            <div>
                <p>{changeResistantText(lust)}</p>
                <p>[x{lust}]</p>
            </div>
        </div>
        <div className="sin-resistant" style={{color:changeResistantColor(sloth)}}>
            <img src="/Images/sin-affinity/affinity_Sloth_big.webp" alt="Sloth-resistant-icon" />
            <div>
                <p>{changeResistantText(sloth)}</p>
                <p>[x{sloth}]</p>
            </div>
        </div>
        <div className="sin-resistant" style={{color:changeResistantColor(gluttony)}}>
            <img src="/Images/sin-affinity/affinity_Gluttony_big.webp" alt="Gluttony-resistant-icon" />
            <div>
                <p>{changeResistantText(gluttony)}</p>
                <p>[x{gluttony}]</p>
            </div>
        </div>
        <div className="sin-resistant" style={{color:changeResistantColor(gloom)}}>
            <img src="/Images/sin-affinity/affinity_Gloom_big.webp" alt="Gloom-resistant-icon" />
            <div>
                <p>{changeResistantText(gloom)}</p>
                <p>[x{gloom}]</p>
            </div>
        </div>
        <div className="sin-resistant" style={{color:changeResistantColor(pride)}}>
            <img src="/Images/sin-affinity/affinity_Pride_big.webp" alt="Pride-resistant-icon" />
            <div>
                <p>{changeResistantText(pride)}</p>
                <p>[x{pride}]</p>
            </div>
        </div>
        <div className="sin-resistant" style={{color:changeResistantColor(envy)}}>
            <img src="/Images/sin-affinity/affinity_Envy_big.webp" alt="Envy-resistant-icon" />
            <div>
                <p>{changeResistantText(envy)}</p>
                <p>[x{envy}]</p>
            </div>
        </div>
    </div>
}