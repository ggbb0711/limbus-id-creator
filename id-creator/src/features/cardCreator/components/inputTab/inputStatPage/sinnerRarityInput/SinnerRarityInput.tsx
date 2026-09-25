import React from "react";
import { ReactElement } from "react";
import "./RarityIconInput.css"
import { useAppSelector, useAppDispatch } from "stores/AppStore";
import { setIdInfo } from "features/cardCreator/stores/IdInfoSlice";

export default function SinnerRarityIconInput():ReactElement{
    const idInfoValue = useAppSelector(state => state.idInfo.value)
    const dispatch = useAppDispatch()

    const set = (rarity: string) => {
        dispatch(setIdInfo({...idInfoValue, rarity}))
    }

    return <div className="rarity-icon-container">
        <img onClick={()=>set("/Images/rarity/IDNumber1.webp")} className={`rarity-icon ${idInfoValue.rarity==="/Images/rarity/IDNumber1.webp"?"active":""}`} src="/Images/rarity/IDNumber1.webp" alt="rarity-icon-1.webp" />
        <img onClick={()=>set("/Images/rarity/IDNumber2.webp")} className={`rarity-icon ${idInfoValue.rarity==="/Images/rarity/IDNumber2.webp"?"active":""}`} src="/Images/rarity/IDNumber2.webp" alt="rarity-icon-2.webp" />
        <img onClick={()=>set("/Images/rarity/IDNumber3.webp")} className={`rarity-icon ${idInfoValue.rarity==="/Images/rarity/IDNumber3.webp"?"active":""}`} src="/Images/rarity/IDNumber3.webp" alt="rarity-icon-3.webp" />
    </div>
}
