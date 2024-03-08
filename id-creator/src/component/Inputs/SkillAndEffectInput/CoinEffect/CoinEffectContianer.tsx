import { CoinEffect, ICoinEffect } from "Interfaces/ActiveSkill/ICoinEffect";
import { useIdInfoContext } from "component/context/IdInfoContext";
import React, { ReactElement } from "react";
import CoinEffectInput from "./CoinEffectInput";


export default function CoinEffectContianer({colIndex,inputIndex}:{colIndex:number,inputIndex:number}):ReactElement{
    const {idInfoValue,setIdInfoValue}=useIdInfoContext()
    
    function addCoin(){
        const newIdInfoValue=idInfoValue

        newIdInfoValue.cols[colIndex][inputIndex].coins.push(new CoinEffect())

        setIdInfoValue({...newIdInfoValue})
    }


    return(
        <div>
            <button onClick={addCoin}>Add coin</button>
            {idInfoValue.cols[colIndex][inputIndex].coins.map((coin:ICoinEffect,i:number)=><CoinEffectInput key={i} colIndex={colIndex} inputIndex={inputIndex} coinIndex={i}/>)}
        </div>
    )
}