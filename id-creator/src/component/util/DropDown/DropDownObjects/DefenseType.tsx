import React from "react";
import { dropDownEl } from "component/util/DropDown/DropDown";


export const DefenseType:{[key:string]:dropDownEl}={
    Block:{
        el:
        <div className="defense-type-drop-down">
            <img src="Images/defense/defense_Block.png" alt="block-defense" />
        </div>,
        value:"Block"
    },
    Dodge:{
        el:
        <div className="defense-type-drop-down">
            <img src="Images/defense/defense_Dodge.png" alt="dodge-defense" />
        </div>,
        value:"Dodge"
    },
    Counter:{
        el:
        <div className="defense-type-drop-down">
            <img src="Images/defense/defense_Counter.png" alt="counter-defense" />
        </div>,
        value:"Counter"
    }}
