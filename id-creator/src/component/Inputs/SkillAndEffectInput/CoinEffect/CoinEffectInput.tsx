import { useIdInfoContext } from "component/context/IdInfoContext";
import React from "react";
import { ReactElement } from "react";
import useCoinEffect from "../util/useCoinEffect";


export default function CoinEffectInput({colIndex,inputIndex,coinIndex}:{colIndex:number,inputIndex:number,coinIndex:number}):ReactElement{
    const {coin,onChangeCoinEffect,onChangeCoinNumber,deleteCoin}=useCoinEffect(colIndex,inputIndex,coinIndex)
    return (
    <div>
        <button onClick={deleteCoin}>Delete coin</button>
        <div>
            <label htmlFor={colIndex+'_'+inputIndex+coinIndex+'_coinNumber'}>Coin number:</label>
            <input type="number" name="coin_Number" id={colIndex+'_'+inputIndex+coinIndex+'_coinNumber'} onChange={onChangeCoinNumber} value={coin.coin}/>
        </div>
        <div>
            <label htmlFor={colIndex+'_'+inputIndex+coinIndex+'_coinEffect'}>Skill name:</label>
            <input type="text" name="coin_effect" id={colIndex+'_'+inputIndex+coinIndex+'_coinEffect'} onChange={onChangeCoinEffect} value={coin.effect}/>
        </div>
    </div>)
}