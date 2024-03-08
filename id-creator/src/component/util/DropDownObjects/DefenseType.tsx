import React from "react";
import { dropDownEl } from "component/DropDown/DropDown";


export const DefenseType:{[key:string]:dropDownEl}={
    Block:{
        el:
        <div className="defense-type-drop-down">
            <p>Block</p>
        </div>,
        value:"Block"
    },
    Dodge:{
        el:
        <div className="defense-type-drop-down">
            <p>Dodge</p>
        </div>,
        value:"Dodge"
    },
    Counter:{
        el:
        <div className="defense-type-drop-down">
            <p>Counter</p>
        </div>,
        value:"Counter"
    }}
