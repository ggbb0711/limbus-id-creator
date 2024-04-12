import useInputs from "component/util/useInputs";
import { IPassiveSkill } from "Interfaces/PassiveSkill/IPassiveSkill";
import React from "react";
import { ReactElement } from "react";
import ChangeInputType from "../Components/ChangeInputType/ChangeInputType";
import DropDown from "component/DropDown/DropDown";
import "../InputPage.css"
import SinAffinityInput from "../Components/SinAffinityInput/SinAffinityInput";
import EditableAutoCorrect from "../Components/EditableAutoCorrectInput/EditableAutoCorrect";



export default function InputPassivePage({passiveSkill,keyWordList,changeSkill,changeSkillType}:{passiveSkill:IPassiveSkill,keyWordList:{[key:string]:string},changeSkill:(newInput:{[type:string]:string|number})=>void,changeSkillType:(newVal:string)=>void}):ReactElement{
    const {onChangeDropDownMenu,onChangeInput,onChangeAutoCorrectInput}=useInputs(passiveSkill as any,changeSkill)

    const {
        name,
        skillLabel,
        skillEffect,
        affinity,
        req,
        reqNo,
        type
    } = passiveSkill

    return <div className="input-page input-passive-page">
        <div className="input-group-container" style={{zIndex:"100"}}>
            <ChangeInputType changeSkillType={changeSkillType} type={type}/>
        </div>
        <div className="input-group-container">
            <div className="input-cotainer center-element">
                <p className="input-label">Passive requirement:</p>
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
                }} propVal={req} cb={onChangeDropDownMenu("req")}/>
            </div>
            
        </div>
        <div className="input-group-container">
            <div className="input-container">
                <p className="input-label">Sin affinity:</p>
                <SinAffinityInput onChangeSinAffinity={onChangeDropDownMenu("affinity")} activeSin={affinity} disabled={req==="None"}/>
            </div>
        </div>
        
        <div className="input-group-container">
            <div className="input-container">
                <label className="input-label" htmlFor="reqNo">Cost:</label>
                <input className={`input ${req==="None"?"disable":""}`} disabled={req==="None"} type="number" id="reqNo" name="reqNo" value={reqNo} onChange={onChangeInput()}/>
            </div>
        </div>
        <div className="input-group-container">
            <div className="input-container">
                <label className="input-label" htmlFor="skillLabel">Skill label:</label>
                <input className="input block" type="text" name="skillLabel" id="skillLabel" value={skillLabel} onChange={onChangeInput()} />
            </div>
        </div>
        <div className="input-group-container">
            <div className="input-container">
                <label className="input-label" htmlFor="name">Passive name:</label>
                <input className="input block" type="string" name="name" id="name" value={name} onChange={onChangeInput()}/>
            </div>
        </div>
        <div className="input-group-container">
            <div className="input-container">
                <label className="input-label" htmlFor="skillEffect">Passive description:</label>
                <p className="effect-guide">To enter a status effect/coin effect/attack effect, put them in square bracket with underscore instead of spacebar like [sinking_deluge]/[coin_1]/[heads_hit] -{">"} 
                    <span contentEditable={false} style={{color:"var(--Debuff-color)",textDecoration:"underline"}}><img className='status-icon' src='Images/status-effect/Sinking_Deluge.png' alt='sinking_deluge_icon' />Sinking Deluge</span>/
                    <span contentEditable={false}><img className='status-icon' src='Images/status-effect/Coin_Effect_1.png' alt='coin-effect-1' /></span>/
                    <span contentEditable={false} style={{color:'#c7ff94'}}>[Heads Hit]</span>
                </p>    
                <EditableAutoCorrect inputId={"skillEffect"} content={skillEffect} changeHandler={onChangeAutoCorrectInput(keyWordList,"skillEffect")} matchList={keyWordList}/>          
            </div>
        </div>
    </div>
}