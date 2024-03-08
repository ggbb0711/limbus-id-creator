import { dropDownEl } from "component/DropDown/DropDown"
import React from "react"

export const skillAffinityDropDown:{[key:string]:dropDownEl}={
    Wrath:{
        el:
        <div className="sin-affinity-drop-down">
            <img src="/Images/sin-affinity/affinity_wrath_big.webp" className="sin-icon-wrath"/>
            <p style={{
                color:"var(--Wrath)"
            }}>Wrath</p>
        </div>,
        value:"Wrath",
    },
    Lust:{
        el:
        <div className="sin-affinity-drop-down">
            <img src="/Images/sin-affinity/affinity_lust_big.webp" alt="sin-icon-lust" />
            <p style={{
                color:"var(--Lust)"
            }}>Lust</p>
        </div>,
        value:"Lust",
    },
    Sloth:{
        el:
        <div className="sin-affinity-drop-down">
            <img src="/Images/sin-affinity/affinity_sloth_big.webp" alt="sin-icon-sloth" />
            <p style={{
                color:"var(--Sloth)"
            }}>Sloth</p>
        </div>,
        value:"Sloth",
    },
    Gluttony:{
        el:
        <div className="sin-affinity-drop-down">
            <img src="/Images/sin-affinity/affinity_gluttony_big.webp" alt="sin-icon-glut" />
            <p style={{
                color:"var(--Glut)"
            }}>Gluttony</p>
        </div>,
        value:"Gluttony",
    },
    Gloom:{
        el:
        <div className="sin-affinity-drop-down">
            <img src="/Images/sin-affinity/affinity_gloom_big.webp" alt="sin-icon-gloom" />
            <p style={{
                color:"var(--Gloom)"
            }}>Gloom</p>
        </div>,
        value:"Gloom",
    },
    Pride:{
        el:
        <div className="sin-affinity-drop-down">
            <img src="/Images/sin-affinity/affinity_pride_big.webp" alt="sin-icon-pride" />
            <p style={{
                color:"var(--Pride)"
            }}>Pride</p>
        </div>,
        value:"Pride",
    },
    Envy:{
        el:
        <div className="sin-affinity-drop-down">
            <img src="/Images/sin-affinity/affinity_envy_big.webp" alt="sin-icon-envy" />
            <p style={{
                color:"var(--Envy)"
            }}>Envy</p>
        </div>,
        value:"Envy",
    }
}