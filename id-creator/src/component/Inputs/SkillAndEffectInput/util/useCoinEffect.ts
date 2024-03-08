import { ICoinEffect } from "Interfaces/ActiveSkill/ICoinEffect"
import { IOffenseSkill } from "Interfaces/OffenseSkill/IOffenseSkill"
import { useIdInfoContext } from "component/context/IdInfoContext"
import { useState, useEffect } from "react"


export default function useCoinEffect(colIndex:number,inputIndex:number,coinIndex:number){
    const {idInfoValue,setIdInfoValue}=useIdInfoContext()
    const [coin,setCoin]=useState<ICoinEffect>(idInfoValue.cols[colIndex][inputIndex].coins[coinIndex])

    function changeCoin(newCoin:ICoinEffect){
        const newCols=[...idInfoValue.cols]
        newCols[colIndex][inputIndex].coins[coinIndex]=newCoin
        const newIdInfoValue={...idInfoValue,cols:newCols}
        setIdInfoValue(newIdInfoValue)
    }

    function onChangeCoinEffect(e:React.ChangeEvent<HTMLInputElement>){
        changeCoin({...coin,effect:e.target.value})
    }

    function onChangeCoinNumber(e:React.ChangeEvent<HTMLInputElement>){
        const newValue = parseInt(e.target.value);
        if (!isNaN(newValue) && newValue > 0 && newValue % 1 === 0) {
            changeCoin({...coin,coin:newValue})
        }
    }

    function deleteCoin(){
        const newIdInfoValue=idInfoValue

        newIdInfoValue.cols[colIndex][inputIndex].coins.splice(coinIndex,1)

        setIdInfoValue({...idInfoValue})
    }

    useEffect(()=>{
        if(JSON.stringify(idInfoValue.cols[colIndex][inputIndex].coins[coinIndex])!==JSON.stringify(coin)) setCoin(idInfoValue.cols[colIndex][inputIndex].coins[coinIndex])
    },[idInfoValue.cols[colIndex][inputIndex].coins[coinIndex]])

    return {coin,onChangeCoinEffect,onChangeCoinNumber,deleteCoin}
}
