import DropDown, { DropDownOption } from "components/ui/dropDown/DropDown";
import React from "react";
import { ReactElement } from "react";
import { SKILL_TYPES, SkillType } from "features/cardCreator/types/SkillTypes";
import { SKILL_DATA } from "features/cardCreator/skills/skillData";

const SKILL_TYPE_OPTIONS: DropDownOption<SkillType>[] = SKILL_TYPES.map(type => ({ el: <p>{SKILL_DATA[type].label}</p>, value: type }))

export default function ChangeInputType({changeSkillType,type}:{changeSkillType:(newVal:SkillType)=>void,type:SkillType}):ReactElement{
    return <DropDown<SkillType> options={SKILL_TYPE_OPTIONS} onChange={changeSkillType} value={type} label="Skill type"/>
}
