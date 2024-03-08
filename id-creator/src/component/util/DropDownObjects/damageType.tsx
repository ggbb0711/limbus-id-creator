import { dropDownEl } from "component/DropDown/DropDown";
import React from "react";

export const damageTypeDropDown:{[key:string]:dropDownEl}={
    Slash:{
        el:
        <div className="damage-type-drop-down">
            <img src="/Images/attack/attackt_slash.webp" alt="slash-attack" />
            <p>Slash</p>
        </div>,
        value:"Slash"
    },
    Pierce:{
        el:
        <div className="damage-type-drop-down">
            <img src="/Images/attack/attackt_pierce.webp" alt="pierce-attack" />
            <p>Pierce</p>
        </div>,
        value:"Pierce"
    },
    Blunt:{
        el:
        <div className="damage-type-drop-down">
            <img src="/Images/attack/attackt_blunt.webp" alt="blunt-attack" />
            <p>Blunt</p>
        </div>,
        value:"Blunt"
    }}