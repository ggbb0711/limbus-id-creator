import DropDown, { DropDownEl } from "components/dropDown/DropDown";
import React from "react";
import { ReactElement } from "react";
import { SKILL_TYPES, SkillType } from "features/cardCreator/types/SkillTypes";
import { SKILL_DATA } from "features/cardCreator/skills/skillData";

const SKILL_TYPE_OPTIONS: { [key: string]: DropDownEl<SkillType> } = Object.fromEntries(
    SKILL_TYPES.map(type => [type, { el: <p>{SKILL_DATA[type].label}</p>, value: type }])
)

export default function ChangeInputType({changeSkillType,type}:{changeSkillType:(newVal:SkillType)=>void,type:SkillType}):ReactElement{
    return <DropDown<SkillType> dropDownEl={SKILL_TYPE_OPTIONS} cb={changeSkillType} propVal={type}/>
}
