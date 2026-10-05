import React from "react";
import { DropDownEl } from "components/ui/dropDown/DropDown";
import "./EgoLevelDropDown.css"
import { EgoLevel } from "features/cardCreator/constants";

export const EgoLevelDropDown:Record<EgoLevel,DropDownEl<EgoLevel>>={
    ZAYIN:{
        el:
        <div>
            <img className="ego-level-drop-down-icon" src="/Images/ego-level/ZAYIN_Level.webp" alt="ZAYIN-level-drop-down" />
        </div>,
        value:"ZAYIN"
    },
    TETH:{
        el:
        <div>
            <img className="ego-level-drop-down-icon" src="/Images/ego-level/TETH_Level.webp" alt="TETH-level-drop-down" />
        </div>,
        value:"TETH"
    },
    HE:{
        el:
        <div>
            <img className="ego-level-drop-down-icon" src="/Images/ego-level/HE_Level.webp" alt="HE-level-drop-down" />
        </div>,
        value:"HE"
    },
    WAW:{
        el:
        <div>
            <img className="ego-level-drop-down-icon" src="/Images/ego-level/WAW_Level.webp" alt="WAW-level-drop-down" />
        </div>,
        value:"WAW"
    },
    ALEPH:{
        el:
        <div>
            <img className="ego-level-drop-down-icon" src="/Images/ego-level/ALEPH_Level.webp" alt="ALEPH-level-drop-down" />
        </div>,
        value:"ALEPH"
    },
    UNDEFINED:{
        el:
        <div>
            <img className="ego-level-drop-down-icon" src="/Images/ego-level/undef.webp" alt="UNDEF-level-drop-down" />
        </div>,
        value:"UNDEFINED"
    }
}

