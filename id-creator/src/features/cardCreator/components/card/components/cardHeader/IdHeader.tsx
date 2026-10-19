import React, { ReactElement } from "react";
import "./CardHeader.css"
import { TraitTagValue } from "features/cardCreator/types/IIdInfo";

interface IdHeaderProps {
    title: string
    name: string
    sinnerColor: string
    rarity: string
    traits: TraitTagValue[]
}

export default function IdHeader({title, name, sinnerColor, rarity, traits}: IdHeaderProps):ReactElement{
    return(
        <div className="header-container">
            <div className="title-traits-row">
                <div className="title-field" style={{background:sinnerColor}}>
                    <p>{title}</p>
                </div>
                {traits.length > 0 && (
                    <div className="traits-container">
                        {traits.map((trait, i) => (
                            <span key={i} className={`trait-badge ${trait.crossed?"crossed":""}`}>{trait.value}</span>
                        ))}
                    </div>
                )}
            </div>
            <div className="center-element">
                <div className="name-field" style={{background:sinnerColor}}>
                    <p>{name}</p>
                </div>
                <img className="sinner-rarity-icon" src={rarity} alt="sinner-rarity-icon" />
            </div>

        </div>
    )
}
