import DropDown from "components/dropDown/DropDown";
import React from "react";
import { ReactElement } from "react";
import { SkillType } from "features/cardCreator/types/SkillTypes";


export default function ChangeInputType({changeSkillType,type}:{changeSkillType:(newVal:SkillType)=>void,type:SkillType}):ReactElement{
    
    return <DropDown<SkillType> dropDownEl={{
        OffenseSkill:{
            el:<p>Offensive skill</p>,
            value:"OffenseSkill"
        },
        DefenseSkill:{
            el:<p>Defense skill</p>,
            value:"DefenseSkill"
        },
        PassiveSkill:{
            el:<p>Passive skill</p>,
            value:"PassiveSkill"
        },
        CustomEffect:{
            el:<p>Custom effect</p>,
            value:"CustomEffect"
        },
        MentalEffect:{
            el:<p>Mental effect</p>,
            value:"MentalEffect"
        },
    }} cb={changeSkillType} propVal={type}/>
}