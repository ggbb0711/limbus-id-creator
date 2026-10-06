import React from "react";
import { ReactElement } from "react";
import "./RarityIconInput.css"
import { useAppSelector, useAppDispatch } from "stores/AppStore";
import { RARITIES } from "features/cardCreator/constants";
import { idInfoSlice } from "features/cardCreator/stores/IdInfoSlice";
import IconOptionPicker from "features/cardCreator/components/shared/iconOptionPicker/IconOptionPicker";

export default function SinnerRarityIconInput(): ReactElement {
    const currentRarity = useAppSelector(state => state.idInfo.value.rarity)
    const dispatch = useAppDispatch()

    return <IconOptionPicker options={RARITIES} active={currentRarity} containerClassName="rarity-icon-container" optionClassName="rarity-icon"
        onSelect={(rarity) => dispatch(idInfoSlice.actions.updateField("rarity", rarity.src))}/>
}
