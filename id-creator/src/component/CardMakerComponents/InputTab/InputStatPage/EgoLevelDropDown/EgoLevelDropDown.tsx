import React from "react";
import { dropDownEl } from "component/util/DropDown/DropDown";
import "./EgoLevelDropDown.css"

export const EgoLevelDropDown:{[key:string]:dropDownEl}={
    ZAYIN:{
        el:
        <div>
            <img className="ego-level-drop-down-icon" src="Images/ego-level/ZAYIN_Level.png" alt="ZAYIN-level-drop-down" />
        </div>,
        value:"ZAYIN"
    },
    TETH:{
        el:
        <div>
            <img className="ego-level-drop-down-icon" src="Images/ego-level/TETH_Level.png" alt="TETH-level-drop-down" />
        </div>,
        value:"TETH"
    },
    HE:{
        el:
        <div>
            <img className="ego-level-drop-down-icon" src="Images/ego-level/HE_Level.png" alt="HE-level-drop-down" />
        </div>,
        value:"HE"
    },
    WAW:{
        el:
        <div>
            <img className="ego-level-drop-down-icon" src="Images/ego-level/WAW_Level.png" alt="WAW-level-drop-down" />
        </div>,
        value:"WAW"
    },
    ALEPH:{
        el:
        <div>
            <img className="ego-level-drop-down-icon" src="Images/ego-level/ALEPH_Level.png" alt="ALEPH-level-drop-down" />
        </div>,
        value:"ALEPH"
    },
    UNDEFINED:{
        el:
        <div>
            <img className="ego-level-drop-down-icon" src="Images/ego-level/undef.png" alt="UNDEF-level-drop-down" />
        </div>,
        value:"UNDEFINED"
    }
}

