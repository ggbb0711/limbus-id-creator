import { getResistTier } from "features/cardCreator/utils/card/getResistTier";
import { ReactElement } from "react";
import "./SinResistant.css"
import React from "react";
import { SinRecord } from "features/cardCreator/constants";

export default function SinResistant({sinResistant}:{sinResistant:SinRecord}):ReactElement{
    const {
        wrath,
        lust,
        sloth,
        gluttony,
        gloom,
        pride,
        envy,
    }=sinResistant

    return <div className="sin-resistant-container">
        <div className="sin-resistant" style={{color:getResistTier(wrath,"sin").color}}>
            <img src="/Images/sin-affinity/affinity_Wrath_big.webp" alt="Wrath-resistant-icon" />
            <div>
                <p>{getResistTier(wrath,"sin").label}</p>
                <p>[x{wrath}]</p>
            </div>
        </div>
        <div className="sin-resistant" style={{color:getResistTier(lust,"sin").color}}>
            <img src="/Images/sin-affinity/affinity_Lust_big.webp" alt="Lust-resistant-icon" />
            <div>
                <p>{getResistTier(lust,"sin").label}</p>
                <p>[x{lust}]</p>
            </div>
        </div>
        <div className="sin-resistant" style={{color:getResistTier(sloth,"sin").color}}>
            <img src="/Images/sin-affinity/affinity_Sloth_big.webp" alt="Sloth-resistant-icon" />
            <div>
                <p>{getResistTier(sloth,"sin").label}</p>
                <p>[x{sloth}]</p>
            </div>
        </div>
        <div className="sin-resistant" style={{color:getResistTier(gluttony,"sin").color}}>
            <img src="/Images/sin-affinity/affinity_Gluttony_big.webp" alt="Gluttony-resistant-icon" />
            <div>
                <p>{getResistTier(gluttony,"sin").label}</p>
                <p>[x{gluttony}]</p>
            </div>
        </div>
        <div className="sin-resistant" style={{color:getResistTier(gloom,"sin").color}}>
            <img src="/Images/sin-affinity/affinity_Gloom_big.webp" alt="Gloom-resistant-icon" />
            <div>
                <p>{getResistTier(gloom,"sin").label}</p>
                <p>[x{gloom}]</p>
            </div>
        </div>
        <div className="sin-resistant" style={{color:getResistTier(pride,"sin").color}}>
            <img src="/Images/sin-affinity/affinity_Pride_big.webp" alt="Pride-resistant-icon" />
            <div>
                <p>{getResistTier(pride,"sin").label}</p>
                <p>[x{pride}]</p>
            </div>
        </div>
        <div className="sin-resistant" style={{color:getResistTier(envy,"sin").color}}>
            <img src="/Images/sin-affinity/affinity_Envy_big.webp" alt="Envy-resistant-icon" />
            <div>
                <p>{getResistTier(envy,"sin").label}</p>
                <p>[x{envy}]</p>
            </div>
        </div>
    </div>
}