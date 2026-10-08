import { getResistTier } from "features/cardCreator/utils/card/getResistTier";
import React, { ReactElement } from "react";
import "./SinResistant.css"
import { SinRecord } from "features/cardCreator/constants";
import { SinValueList } from "features/cardCreator/components/shared/SinNumberInputs";
import { assetPaths } from "features/cardCreator/utils/card/assetPaths";

export default function SinResistant({ sinResistant }: { sinResistant: SinRecord }): ReactElement {
    return <div className="sin-resistant-container">
        <SinValueList values={sinResistant} render={(sin, value) => {
            const tier = getResistTier(value)
            return <div className="sin-resistant" style={{ color: tier.color }}>
                <img src={assetPaths.affinityBig(sin)} alt={`${sin}-resistant-icon`} />
                <div>
                    <p>{tier.label}</p>
                    <p>[x{value}]</p>
                </div>
            </div>
        }}/>
    </div>
}
