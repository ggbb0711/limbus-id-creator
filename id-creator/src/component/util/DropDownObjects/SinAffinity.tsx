import { dropDownEl } from "component/DropDown/DropDown"
import React from "react"

export const skillAffinityDropDown:{[key:string]:dropDownEl}={
    Wrath:{
        el:<p>Wrath</p>,
        value:"Wrath",
        style:{color:"var(--Wrath)"},
    },
    Lust:{
        el:<p>Lust</p>,
        value:"Lust"
    },
    Sloth:{
        el:<p>Sloth</p>,
        value:"Sloth"
    },
    Gluttony:{
        el:<p>Gluttony</p>,
        value:"Gluttony"
    },
    Pride:{
        el:<p>Pride</p>,
        value:"Pride"
    },
    Gloom:{
        el:<p>Gloom</p>,
        value:"Gloom"
    },
    Envy:{
        el:<p>Envy</p>,
        value:"Envy"
    }
}