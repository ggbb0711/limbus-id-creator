import React from "react";
import { ReactElement } from "react";
import useInput from "../util/useInput";
import DropDown from "component/DropDown/DropDown";
import { skillAffinityDropDown } from "component/util/DropDownObjects/SinAffinity";
import { damageTypeDropDown } from "component/util/DropDownObjects/damageType";
import CoinEffectContianer from "../CoinEffect/CoinEffectContianer";
import { IDefenseSkill } from "Interfaces/DefenseSkill/IDefenseSkill";
import { DefenseType } from "component/util/DropDownObjects/DefenseType";
import { IOffenseSkill } from "Interfaces/OffenseSkill/IOffenseSkill";

export default function DefenseSkillInput({colIndex,inputIndex}:{colIndex:number,inputIndex:number}):ReactElement{
    const {inputs,onChangeInput,onChangeDropDownMenu,onChangeFile,deleteInput}=useInput(colIndex,inputIndex)

    return (
        <div>
            <button onClick={deleteInput}>Delete</button>
            <DropDown dropDownEl={DefenseType} propVal={(inputs as IDefenseSkill).defenseType} cb={onChangeDropDownMenu("defenseType")}/>
            {(inputs as IDefenseSkill).defenseType==="Counter"?<DropDown dropDownEl={damageTypeDropDown} propVal={(inputs as IOffenseSkill).damageType} cb={onChangeDropDownMenu("damageType")}/>:<></>}
            <DropDown dropDownEl={skillAffinityDropDown} propVal={(inputs as IDefenseSkill).skillAffinity} cb={onChangeDropDownMenu("skillAffinity")}/>
            <div>
                <label htmlFor={colIndex+'_'+inputIndex+'_name'}>Skill name:</label>
                <input type="text" name="name" id={colIndex+'_'+inputIndex+'_name'} onChange={onChangeInput} value={(inputs as IDefenseSkill).name} placeholder="Skill name"/>
            </div>
            <div>
                <label htmlFor={colIndex+'_'+inputIndex+'_basePower'}>Base power:</label>
                <input type="number" name="basePower" id={colIndex+'_'+inputIndex+'_basePower'} onChange={onChangeInput} value={(inputs as IDefenseSkill).basePower} placeholder="Base power"/>
            </div>
            <div>
                <label htmlFor={colIndex+'_'+inputIndex+'_coinNo'}>Number of coins:</label>
                <input type="number" name="coinNo" id={colIndex+'_'+inputIndex+'_coinNo'} onChange={onChangeInput} value={(inputs as IDefenseSkill).coinNo} placeholder="Coin number"/>
            </div>
            <div>
                <label htmlFor={colIndex+'_'+inputIndex+'_coinPower'}>Coin power:</label>
                <input type="number" name="coinPow" id={colIndex+'_'+inputIndex+'_coinPower'} onChange={onChangeInput} value={(inputs as IDefenseSkill).coinPow} placeholder="Coin power"/>
            </div>
            <div>
                <label htmlFor={colIndex+'_'+inputIndex+'_skillLabel'}>Skill label:</label>
                <input type="text" name="skillLabel" id={colIndex+'_'+inputIndex+'_skillLabel'} onChange={onChangeInput} value={(inputs as IDefenseSkill).skillLabel} placeholder="Skill label"/>
            </div>
            <div>
                <label htmlFor={colIndex+'_'+inputIndex+'_skillEffect'}>Skill effect:</label>
                <textarea name="skillEffect" id={colIndex+'_'+inputIndex+'_skillEffect'} onChange={onChangeInput} placeholder="Skill effect" value={(inputs as IDefenseSkill).skillEffect}></textarea>
            </div>
            <div>
            <label htmlFor={colIndex+'_'+inputIndex+'_skillImage'}>Skill image:</label>
                <input type="file" name="skillImage" id={colIndex+'_'+inputIndex+'_skillImage'} onChange={onChangeFile}/>
            </div>
            <CoinEffectContianer colIndex={colIndex} inputIndex={inputIndex}/>
        </div>
    )
}