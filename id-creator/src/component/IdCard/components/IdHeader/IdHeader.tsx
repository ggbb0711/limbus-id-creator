import { useIdInfoContext } from "component/context/IdInfoContext";
import React, { ReactElement } from "react";
import "./IdHeader.css"

export default function IdHeader():ReactElement{
    const {idInfoValue} = useIdInfoContext()

    return(
        <div className="IdHeader">
            <div className="title-field" style={{background:idInfoValue.sinnerColor}}>
                <p>{idInfoValue.title}</p>
            </div>
            <div className="center-element">
                <div className="name-field" style={{background:idInfoValue.sinnerColor}}>
                    <p>{idInfoValue.name}</p>
                </div>
                <img className="sinner-rarity-icon" src={idInfoValue.rarity} alt="sinner-rarity-icon" />
            </div>

        </div>
    )
}