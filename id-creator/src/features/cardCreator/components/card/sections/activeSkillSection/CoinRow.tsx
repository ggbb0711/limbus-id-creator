import React, { ReactElement, memo } from "react";
import { CoinEffect, MAX_DRAWN_COINS, getCoinEffects } from "features/cardCreator/utils/card/getCoinEffect";
import { assetPaths } from "features/cardCreator/utils/card/assetPaths";

function Coin({ effect }: { effect: CoinEffect }): ReactElement {
    switch (effect.type) {
        case "unbreakable":
            return <img src={assetPaths.coin.unbreakable} alt="unbreakable_coin_icon" />
        case "excision":
            return <img src={assetPaths.coin.excision} alt="excision_coin_icon" />
        case "custom":
            return effect.imageSrc
                ? <img className="custom-coin-icon" src={effect.imageSrc} alt={`${effect.name}_coin_icon`} crossOrigin="anonymous" />
                : <span className="custom-coin-fallback" style={{ color: effect.color }} title={effect.name}>{effect.name[0] ?? "?"}</span>
        default:
            return <img src={assetPaths.coin.normal} alt="coin_icon" />
    }
}

const CoinRow = memo(function CoinRow({ coinNo, skillEffect }: { coinNo: number, skillEffect: string }): ReactElement {
    return <div className="coin-container">
        {getCoinEffects(skillEffect, coinNo).map((effect, i) => <Coin key={i} effect={effect} />)}
        {coinNo > MAX_DRAWN_COINS ? `x ${coinNo}` : ""}
    </div>
})

export default CoinRow
