import React, { ReactElement } from "react";
import useInput from "../util/useInput";
import DropDown from "component/DropDown/DropDown";
import { skillAffinityDropDown } from "component/util/DropDownObjects/SinAffinity";
import { IOffenseSkill } from "Interfaces/OffenseSkill/IOffenseSkill";
import { ICustomEffect } from "Interfaces/CustomEffect/ICustomEffect";
import { IPassiveSkill, PassiveSkill } from "Interfaces/PassiveSkill/IPassiveSkill";

export default function PassiveSkillInput({colIndex,inputIndex}:{colIndex:number,inputIndex:number}):ReactElement{
    const {inputs,onChangeInput,onChangeDropDownMenu,deleteInput} = useInput(colIndex,inputIndex)

    return(
        <div>
            <button onClick={deleteInput}>Delete</button>
            <DropDown dropDownEl={skillAffinityDropDown} propVal={(inputs as IOffenseSkill).skillAffinity} cb={onChangeDropDownMenu("skillAffinity")}/>
            <DropDown dropDownEl={{
                Res:{
                    el:<p>Res</p>,
                    value:"Res"
                },
                Own:{
                    el:<p>Own</p>,
                    value:"Own"
                },
                None:{
                    el:<p>None</p>,
                    value:"None"
                }
            }} cb={onChangeDropDownMenu("req")} propVal={(inputs as IPassiveSkill).req}/>
            <div>
                <label htmlFor={colIndex+'_'+inputIndex+'_name'}>Skill name:</label>
                <input type="text" name="name" id={colIndex+'_'+inputIndex+'_name'} onChange={onChangeInput} value={(inputs as IPassiveSkill).name} placeholder="Skill name"/>
            </div>
            <div>
                <label htmlFor={colIndex+'_'+inputIndex+'_skillEffect'}>Skill name:</label>
                <input type="text" name="skillEffect" id={colIndex+'_'+inputIndex+'_skillEffect'} onChange={onChangeInput} value={(inputs as IPassiveSkill).skillEffect} placeholder="Skill effect"/>
            </div>
            {(inputs as IPassiveSkill).req!=="None"?
            <div>
                <label htmlFor={colIndex+'_'+inputIndex+'_reqNo'}>Requirement number:</label>
                <input type="number" name="reqNo" id={colIndex+'_'+inputIndex+'_reqNo'} onChange={onChangeInput} value={(inputs as IPassiveSkill).reqNo}/>
            </div>:<></>}
        </div>
    )
}