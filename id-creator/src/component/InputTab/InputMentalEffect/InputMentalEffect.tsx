import useInputs from "component/util/useInputs";
import { IMentalEffect } from "Interfaces/MentalEffect/IMentalEffect";
import React from "react";
import { ReactElement } from "react";
import ChangeInputType from "../Components/ChangeInputType/ChangeInputType";
import EditableAutoCorrect from "../Components/EditableAutoCorrectInput/EditableAutoCorrect";


export default function InputMentalEffect({mentalEffect,keyWordList,changeSkill,changeSkillType}:{mentalEffect:IMentalEffect,keyWordList:{[key:string]:string},changeSkill:(newInput:{[type:string]:string|number})=>void,changeSkillType:(newVal:string)=>void}):ReactElement{
    const {onChangeAutoCorrectInput} = useInputs(mentalEffect as any,changeSkill)
    
    const {effect,type} = mentalEffect

    return <div className="input-page">
        <ChangeInputType changeSkillType={changeSkillType} type={type}/>
        <div className="input-group-container">
            <div className="input-container">
            <label className="input-label" htmlFor="effect">Mental effect:</label>
            <p className="effect-guide">To enter a status effect/coin effect/attack effect, put them in square bracket with underscore instead of spacebar like [sinking_deluge]/[coin_1]/[heads_hit] -{">"} 
                    <span className="center-element" contentEditable={false} style={{color:"var(--Debuff-color)",textDecoration:"underline"}}><img className='status-icon' src='Images/status-effect/Sinking_Deluge.png' alt='sinking_deluge_icon' />Sinking Deluge</span>/
                    <span className="center-element" contentEditable={false}><img className='status-icon' src='Images/status-effect/Coin_Effect_1.png' alt='coin-effect-1' /></span>/
                    <span className="center-element" contentEditable={false} style={{color:'#c7ff94'}}>[Heads Hit]</span>
                </p>
            <EditableAutoCorrect inputId={"effect"} content={effect} changeHandler={onChangeAutoCorrectInput(keyWordList,"effect")} matchList={keyWordList}/>     
            </div>
        </div>
    </div>
}