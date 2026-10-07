import React from "react";
import { DropDownOption } from "components/ui/dropDown/DropDown";
import "./EgoLevelDropDown.css"
import { EGO_LEVELS, EgoLevel } from "features/cardCreator/constants";

const iconFor = (level: EgoLevel) => level === "UNDEFINED" ? "/Images/ego-level/undef.webp" : `/Images/ego-level/${level}_Level.webp`

export const EGO_LEVEL_OPTIONS: DropDownOption<EgoLevel>[] = EGO_LEVELS.map(level => ({
    value: level,
    el: <div>
        <img className="ego-level-drop-down-icon" src={iconFor(level)} alt={`${level === "UNDEFINED" ? "UNDEF" : level}-level-drop-down`} />
    </div>,
}))
