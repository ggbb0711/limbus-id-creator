import useInputs from "component/util/useInputs";
import { IPassiveSkill } from "Interfaces/PassiveSkill/IPassiveSkill";
import React from "react";
import { ReactElement } from "react";
import ChangeInputType from "../Components/ChangeInputType/ChangeInputType";
import DropDown from "component/DropDown/DropDown";
import "../InputPage.css"
import SinAffinityInput from "../Components/SinAffinityInput/SinAffinityInput";
import EditableAutoCorrect from "../Components/EditableAutoCorrectInput/EditableAutoCorrect";
import Delete_icon from "Icons/Delete_icon";
import Arrow_down_icon from "Icons/Arrow_down_icon";



export default function InputPassivePage({
    passiveSkill,
    keyWordList,
    changeSkill,
    changeSkillType,
    deleteSkill,
    collaspPage}:{
        passiveSkill:IPassiveSkill,
        keyWordList:{[key:string]:string},
        changeSkill:(newInput:{[type:string]:string|number})=>void,
        changeSkillType:(newVal:string)=>void,
        deleteSkill:(inputID:string)=>void,
        collaspPage:()=>void}):ReactElement{
    const {onChangeDropDownMenu,onChangeInput,onChangeAutoCorrectInput}=useInputs(passiveSkill as any,changeSkill)

    const {
        name,
        skillLabel,
        skillEffect,
        ownCost:{
            wrath_cost:wrath_own_cost,
            lust_cost:lust_own_cost,
            sloth_cost:sloth_own_cost,
            gluttony_cost:gluttony_own_cost,
            gloom_cost:gloom_own_cost,
            pride_cost:pride_own_cost,
            envy_cost:envy_own_cost,
        },
        resCost:{
            wrath_cost:wrath_res_cost,
            lust_cost:lust_res_cost,
            sloth_cost:sloth_res_cost,
            gluttony_cost:gluttony_res_cost,
            gloom_cost:gloom_res_cost,
            pride_cost:pride_res_cost,
            envy_cost:envy_res_cost,
        },
        req,
        type,
        inputId
    } = passiveSkill

    return <div className="input-page input-passive-page">
        <div className="input-page-icon-container">
            <div className="collasp-icon" onClick={collaspPage}>
                <Arrow_down_icon></Arrow_down_icon>
            </div>
            <div className="delete-icon" onClick={()=>deleteSkill(inputId)}>
                <Delete_icon></Delete_icon>
            </div>
        </div>
        <div className="input-group-container">
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
        
        <p>Sin Own</p>
        <div className="input-group-container">
            <div className="input-container center-element-vertically">
                <label htmlFor="wrath_own_cost"><img className="stat-icon" src="Images/sin-affinity/affinity_Wrath_big.webp" alt="wrath-input-resistant-icon" /></label>
                <div className="resistant-content">
                    <div>
                        <input type="number" className="input stat-page-input-border input-number" value={wrath_own_cost} onChange={onChangeInput("ownCost.wrath_cost")} name="wrath_own_cost" id="wrath_own_cost"/>
                    </div>
                </div>
            </div>
            <div className="input-container center-element-vertically">
                <label htmlFor="lust_own_cost"><img className="stat-icon" src="Images/sin-affinity/affinity_Lust_big.webp" alt="lust-input-resistant-icon" /></label>
                <div className="resistant-content">
                    <div>
                        <input type="number" className="input stat-page-input-border input-number" value={lust_own_cost} onChange={onChangeInput("ownCost.lust_cost")} name="lust_own_cost" id="lust_own_cost"/>
                    </div>
                </div>
            </div>
            <div className="input-container center-element-vertically">
                <label htmlFor="sloth_own_cost"><img className="stat-icon" src="Images/sin-affinity/affinity_Sloth_big.webp" alt="sloth-input-resistant-icon" /></label>
                <div className="resistant-content">
                    <div>
                        <input type="number" className="input stat-page-input-border input-number" value={sloth_own_cost} onChange={onChangeInput("ownCost.sloth_cost")} name="sloth_own_cost" id="sloth_own_cost"/>
                    </div>
                </div>
            </div>
            <div className="input-container center-element-vertically">
                <label htmlFor="gluttony_own_cost"><img className="stat-icon" src="Images/sin-affinity/affinity_Gluttony_big.webp" alt="gluttony-input-resistant-icon" /></label>
                <div className="resistant-content">
                    <div>
                        <input type="number" className="input stat-page-input-border input-number" value={gluttony_own_cost} onChange={onChangeInput("ownCost.gluttony_cost")} name="gluttony_own_cost" id="gluttony_own_cost"/>
                    </div>
                </div>
            </div>
            <div className="input-container center-element-vertically">
                <label htmlFor="gloom_own_cost"><img className="stat-icon" src="Images/sin-affinity/affinity_Gloom_big.webp" alt="gloom-input-resistant-icon" /></label>
                <div className="resistant-content">
                    <div>
                        <input type="number" className="input stat-page-input-border input-number" value={gloom_own_cost} onChange={onChangeInput("ownCost.gloom_cost")} name="gloom_own_cost" id="gloom_own_cost"/>
                    </div>
                </div>
            </div>
            <div className="input-container center-element-vertically">
                <label htmlFor="pride_own_cost"><img className="stat-icon" src="Images/sin-affinity/affinity_Pride_big.webp" alt="pride-input-resistant-icon" /></label>
                <div className="resistant-content">
                    <div>
                        <input type="number" className="input stat-page-input-border input-number" value={pride_own_cost} onChange={onChangeInput("ownCost.pride_cost")} name="pride_own_cost" id="pride_own_cost"/>
                    </div>
                </div>
            </div>
            <div className="input-container center-element-vertically">
                <label htmlFor="envy_own_cost"><img className="stat-icon" src="Images/sin-affinity/affinity_Envy_big.webp" alt="envy-input-resistant-icon" /></label>
                <div className="resistant-content">
                    <div>
                        <input type="number" className="input stat-page-input-border input-number" value={envy_own_cost} onChange={onChangeInput("ownCost.envy_cost")} name="envy_own_cost" id="envy_own_cost"/>
                    </div>
                </div>
            </div>
        </div>
        <p>Sin Res</p>
        <div className="input-group-container">
            <div className="input-container center-element-vertically">
                <label htmlFor="wrath_res_cost"><img className="stat-icon" src="Images/sin-affinity/affinity_Wrath_big.webp" alt="wrath-input-resistant-icon" /></label>
                <div className="resistant-content">
                    <div>
                        <input type="number" className="input stat-page-input-border input-number" value={wrath_res_cost} onChange={onChangeInput("resCost.wrath_cost")} name="wrath_res_cost" id="wrath_res_cost"/>
                    </div>
                </div>
            </div>
            <div className="input-container center-element-vertically">
                <label htmlFor="lust_res_cost"><img className="stat-icon" src="Images/sin-affinity/affinity_Lust_big.webp" alt="lust-input-resistant-icon" /></label>
                <div className="resistant-content">
                    <div>
                        <input type="number" className="input stat-page-input-border input-number" value={lust_res_cost} onChange={onChangeInput("resCost.lust_cost")} name="lust_res_cost" id="lust_res_cost"/>
                    </div>
                </div>
            </div>
            <div className="input-container center-element-vertically">
                <label htmlFor="sloth_res_cost"><img className="stat-icon" src="Images/sin-affinity/affinity_Sloth_big.webp" alt="sloth-input-resistant-icon" /></label>
                <div className="resistant-content">
                    <div>
                        <input type="number" className="input stat-page-input-border input-number" value={sloth_res_cost} onChange={onChangeInput("resCost.sloth_cost")} name="sloth_res_cost" id="sloth_res_cost"/>
                    </div>
                </div>
            </div>
            <div className="input-container center-element-vertically">
                <label htmlFor="gluttony_res_cost"><img className="stat-icon" src="Images/sin-affinity/affinity_Gluttony_big.webp" alt="gluttony-input-resistant-icon" /></label>
                <div className="resistant-content">
                    <div>
                        <input type="number" className="input stat-page-input-border input-number" value={gluttony_res_cost} onChange={onChangeInput("resCost.gluttony_cost")} name="gluttony_res_cost" id="gluttony_res_cost"/>
                    </div>
                </div>
            </div>
            <div className="input-container center-element-vertically">
                <label htmlFor="gloom_res_cost"><img className="stat-icon" src="Images/sin-affinity/affinity_Gloom_big.webp" alt="gloom-input-resistant-icon" /></label>
                <div className="resistant-content">
                    <div>
                        <input type="number" className="input stat-page-input-border input-number" value={gloom_res_cost} onChange={onChangeInput("resCost.gloom_cost")} name="gloom_res_cost" id="gloom_res_cost"/>
                    </div>
                </div>
            </div>
            <div className="input-container center-element-vertically">
                <label htmlFor="pride_res_cost"><img className="stat-icon" src="Images/sin-affinity/affinity_Pride_big.webp" alt="pride-input-resistant-icon" /></label>
                <div className="resistant-content">
                    <div>
                        <input type="number" className="input stat-page-input-border input-number" value={pride_res_cost} onChange={onChangeInput("resCost.pride_cost")} name="pride_res_cost" id="pride_res_cost"/>
                    </div>
                </div>
            </div>
            <div className="input-container center-element-vertically">
                <label htmlFor="envy_res_cost"><img className="stat-icon" src="Images/sin-affinity/affinity_Envy_big.webp" alt="envy-input-resistant-icon" /></label>
                <div className="resistant-content">
                    <div>
                        <input type="number" className="input stat-page-input-border input-number" value={envy_res_cost} onChange={onChangeInput("resCost.envy_cost")} name="envy_res_cost" id="envy_res_cost"/>
                    </div>
                </div>
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