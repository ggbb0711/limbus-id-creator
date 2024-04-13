import React, { ReactElement } from "react";
import "./InputTabContainer.css"
import InputTabIdInfoContainer from "./InputTabIdInfoContainer/InputTabIdInfoContainer";
import InputTabEgoInfoContainer from "./InputTabEgoInfoContainer/InputTabEgoInfoContainer";

export default function InputTabContainer({mode}:{mode:string}):ReactElement{
    return (mode==="IdInfo")?<InputTabIdInfoContainer/>:<InputTabEgoInfoContainer/>
}