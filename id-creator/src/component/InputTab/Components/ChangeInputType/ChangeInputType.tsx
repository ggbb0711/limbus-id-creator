import { type } from "@testing-library/user-event/dist/type";
import DropDown from "component/DropDown/DropDown";
import React from "react";
import { ReactElement } from "react";


export default function ChangeInputType({changeSkillType,type}:{changeSkillType:(newVal:string)=>void,type:string}):ReactElement{
    return <DropDown dropDownEl={{
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