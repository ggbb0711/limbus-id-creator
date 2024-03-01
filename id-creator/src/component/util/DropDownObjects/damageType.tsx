import { dropDownEl } from "component/DropDown/DropDown";
import React from "react";

export const damageTypeDropDown:{[key:string]:dropDownEl}={
    Slash:{
        el:<p>Slash</p>,
        value:"Slash"
    },
    Pierce:{
        el:<p>Pierce</p>,
        value:"Pierce"
    },
    Blunt:{
        el:<p>Blunt</p>,
        value:"Blunt"
    }}