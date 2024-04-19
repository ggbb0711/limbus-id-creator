import React from "react";
import { ReactElement } from "react";
import "./ActivateSaveMenuBtn.css"


export default function ActivateSaveMenuBtn({onClickHandler}):ReactElement{
    return <div className="activate-save-menu-btn" onClick={onClickHandler}>
        Save
    </div>
}