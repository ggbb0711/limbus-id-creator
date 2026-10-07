import React from "react";
import { ReactElement } from "react";
import "./SkillFrameInput.css"
import { assetPaths } from "features/cardCreator/utils/card/assetPaths";
import { SinAffinity, SkillFrame } from "features/cardCreator/constants";

export default function SkillFrameInput({onChangeSkillFrame,activeFrame,skillAffinity}:{onChangeSkillFrame:(frame:SkillFrame)=>void,activeFrame:SkillFrame,skillAffinity:SinAffinity}):ReactElement{
    const disabled = skillAffinity === "None"
    return <div className="skill-frame-input-container">
        {disabled?<div className="disabled"></div>:<></>}
        <img className={`skill-frame-input-option ${activeFrame==="1"?"active":""}`} src={assetPaths.skillFrame(skillAffinity, "1")} alt="frame-1" onClick={()=>onChangeSkillFrame("1")}/>
        <img className={`skill-frame-input-option ${activeFrame==="2"?"active":""}`} src={assetPaths.skillFrame(skillAffinity, "2")} alt="frame-2" onClick={()=>onChangeSkillFrame("2")}/>
        <img className={`skill-frame-input-option ${activeFrame==="3"?"active":""}`} src={assetPaths.skillFrame(skillAffinity, "3")} alt="frame-3" onClick={()=>onChangeSkillFrame("3")}/>
    </div>
}
