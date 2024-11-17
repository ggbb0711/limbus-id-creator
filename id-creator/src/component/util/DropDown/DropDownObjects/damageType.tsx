import { dropDownEl } from "component/util/DropDown/DropDown";
import React from "react";

export const damageTypeDropDown:{[key:string]:dropDownEl}={
    Slash:{
        el:
        <div className="damage-type-drop-down">
            <img src="Images/attack/attackt_Slash.webp" alt="slash-attack" />
        </div>,
        value:"Slash"
    },
    Pierce:{
        el:
        <div className="damage-type-drop-down">
            <img src="Images/attack/attackt_Pierce.webp" alt="pierce-attack" />
        </div>,
        value:"Pierce"
    },
    Blunt:{
        el:
        <div className="damage-type-drop-down">
            <img src="Images/attack/attackt_Blunt.webp" alt="blunt-attack" />
        </div>,
        value:"Blunt"
    }}