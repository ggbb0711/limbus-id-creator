import React, { ReactElement } from "react";
import "./SinCost.css"
import { SinRecord } from "features/cardCreator/constants";
import { SinValueList } from "features/cardCreator/components/shared/SinNumberInputs";
import { assetPaths } from "features/cardCreator/utils/card/assetPaths";

const textColor = (cost: number) => cost > 0 ? "#EBC9A8" : "#8E8A82"

export default function SinCost({ sinCost }: { sinCost: SinRecord }): ReactElement {
    return <div className="sin-cost-container">
        <p className="cost-txt">COST</p>
        <SinValueList values={sinCost} render={(sin, cost) =>
            <div className="center-element sin-cost" style={{ color: textColor(cost) }}>
                <img src={assetPaths.affinityBig(sin)} alt={`${sin}-cost-icon`} />
                <p>{cost}</p>
            </div>
        }/>
    </div>
}
