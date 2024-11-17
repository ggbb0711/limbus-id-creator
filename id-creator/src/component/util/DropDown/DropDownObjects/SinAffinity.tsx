import { dropDownEl } from "component/util/DropDown/DropDown"
import React from "react"

export const SinAffinityDropDown:{[key:string]:dropDownEl}={
    Wrath:{
        el:
        <div className="sin-affinity-drop-down">
            <img src="Images/sin-affinity/affinity_Wrath_big.webp" className="sin-icon-wrath"/>
        </div>,
        value:"Wrath",
    },
    Lust:{
        el:
        <div className="sin-affinity-drop-down">
            <img src="Images/sin-affinity/affinity_Lust_big.webp" alt="sin-icon-lust" />
        </div>,
        value:"Lust",
    },
    Sloth:{
        el:
        <div className="sin-affinity-drop-down">
            <img src="Images/sin-affinity/affinity_Sloth_big.webp" alt="sin-icon-sloth" />
        </div>,
        value:"Sloth",
    },
    Gluttony:{
        el:
        <div className="sin-affinity-drop-down">
            <img src="Images/sin-affinity/affinity_Gluttony_big.webp" alt="sin-icon-glut" />
        </div>,
        value:"Gluttony",
    },
    Gloom:{
        el:
        <div className="sin-affinity-drop-down">
            <img src="Images/sin-affinity/affinity_Gloom_big.webp" alt="sin-icon-gloom" />
        </div>,
        value:"Gloom",
    },
    Pride:{
        el:
        <div className="sin-affinity-drop-down">
            <img src="Images/sin-affinity/affinity_Pride_big.webp" alt="sin-icon-pride" />
        </div>,
        value:"Pride",
    },
    Envy:{
        el:
        <div className="sin-affinity-drop-down">
            <img src="Images/sin-affinity/affinity_Envy_big.webp" alt="sin-icon-envy" />
        </div>,
        value:"Envy",
    },
    None:{
        el:
        <div className="sin-affinity-drop-down">
            None
        </div>,
        value:"None",
    }
}