import { IPassiveSkill } from "Features/CardCreator/Types/Skills/PassiveSkill/IPassiveSkill";
import React, { useState } from "react";
import { ReactElement } from "react";
import "../InputPage.css"
import "../InputStatPage/InputStatPage.css"
import DeleteIcon from "Assets/Icons/DeleteIcon";
import ArrowDownIcon from "Assets/Icons/ArrowDownIcon";
import AccordionSection from "Components/AccordionSection/AccordionSection";
import ConfirmDialog from "Components/ConfirmDialog/ConfirmDialog";
import ChangeInputType from "../Components/ChangeInputType/ChangeInputType";
import TipTapEditor from "../Components/TipTapEditor/TipTapEditor";
import { useSkillForm } from "Features/CardCreator/Hooks/useSkillForm";

export default function InputPassivePage({
    index,
    collaspPage}:{
        index:number,
        collaspPage:()=>void}):ReactElement{

    const { register, setValue, watch, deleteSkill, changeSkillType, registerNumber, keyWordList } = useSkillForm<IPassiveSkill>(index)
    const [showConfirm, setShowConfirm] = useState(false)

    const type = watch("type")
    const skillEffect = watch("skillEffect")

    return <div className="input-page input-passive-page">
        <div className="input-page-icon-container">
            <div className="collasp-icon" onClick={collaspPage}>
                <ArrowDownIcon></ArrowDownIcon>
            </div>
        </div>
        <div className="input-group-container">
            <label className="input-label">Change skill:</label>
            <ChangeInputType changeSkillType={changeSkillType} type={type}/>
        </div>

        <AccordionSection title="Passive Requirements">
            <p className="input-label">Sin Own</p>
            <div className="input-group-container">
                <div className="input-container center-element-vertically">
                    <label htmlFor="wrath_own_cost"><img className="stat-icon" src="/Images/sin-affinity/affinity_Wrath_big.webp" alt="wrath-input-resistant-icon" /></label>
                    <div className="resistant-content">
                        <div>
                            <input type="number" className="input stat-page-input-border input-number" {...registerNumber("ownCost.wrath_cost")} id="wrath_own_cost"/>
                        </div>
                    </div>
                </div>
                <div className="input-container center-element-vertically">
                    <label htmlFor="lust_own_cost"><img className="stat-icon" src="/Images/sin-affinity/affinity_Lust_big.webp" alt="lust-input-resistant-icon" /></label>
                    <div className="resistant-content">
                        <div>
                            <input type="number" className="input stat-page-input-border input-number" {...registerNumber("ownCost.lust_cost")} id="lust_own_cost"/>
                        </div>
                    </div>
                </div>
                <div className="input-container center-element-vertically">
                    <label htmlFor="sloth_own_cost"><img className="stat-icon" src="/Images/sin-affinity/affinity_Sloth_big.webp" alt="sloth-input-resistant-icon" /></label>
                    <div className="resistant-content">
                        <div>
                            <input type="number" className="input stat-page-input-border input-number" {...registerNumber("ownCost.sloth_cost")} id="sloth_own_cost"/>
                        </div>
                    </div>
                </div>
                <div className="input-container center-element-vertically">
                    <label htmlFor="gluttony_own_cost"><img className="stat-icon" src="/Images/sin-affinity/affinity_Gluttony_big.webp" alt="gluttony-input-resistant-icon" /></label>
                    <div className="resistant-content">
                        <div>
                            <input type="number" className="input stat-page-input-border input-number" {...registerNumber("ownCost.gluttony_cost")} id="gluttony_own_cost"/>
                        </div>
                    </div>
                </div>
                <div className="input-container center-element-vertically">
                    <label htmlFor="gloom_own_cost"><img className="stat-icon" src="/Images/sin-affinity/affinity_Gloom_big.webp" alt="gloom-input-resistant-icon" /></label>
                    <div className="resistant-content">
                        <div>
                            <input type="number" className="input stat-page-input-border input-number" {...registerNumber("ownCost.gloom_cost")} id="gloom_own_cost"/>
                        </div>
                    </div>
                </div>
                <div className="input-container center-element-vertically">
                    <label htmlFor="pride_own_cost"><img className="stat-icon" src="/Images/sin-affinity/affinity_Pride_big.webp" alt="pride-input-resistant-icon" /></label>
                    <div className="resistant-content">
                        <div>
                            <input type="number" className="input stat-page-input-border input-number" {...registerNumber("ownCost.pride_cost")} id="pride_own_cost"/>
                        </div>
                    </div>
                </div>
                <div className="input-container center-element-vertically">
                    <label htmlFor="envy_own_cost"><img className="stat-icon" src="/Images/sin-affinity/affinity_Envy_big.webp" alt="envy-input-resistant-icon" /></label>
                    <div className="resistant-content">
                        <div>
                            <input type="number" className="input stat-page-input-border input-number" {...registerNumber("ownCost.envy_cost")} id="envy_own_cost"/>
                        </div>
                    </div>
                </div>
            </div>
            <p className="input-label">Sin Res</p>
                <div className="input-group-container">
                    <div className="input-container center-element-vertically">
                        <label htmlFor="wrath_res_cost"><img className="stat-icon" src="/Images/sin-affinity/affinity_Wrath_big.webp" alt="wrath-input-resistant-icon" /></label>
                        <div className="resistant-content">
                            <div>
                                <input type="number" className="input stat-page-input-border input-number" {...registerNumber("resCost.wrath_cost")} id="wrath_res_cost"/>
                            </div>
                        </div>
                    </div>
                    <div className="input-container center-element-vertically">
                        <label htmlFor="lust_res_cost"><img className="stat-icon" src="/Images/sin-affinity/affinity_Lust_big.webp" alt="lust-input-resistant-icon" /></label>
                        <div className="resistant-content">
                            <div>
                                <input type="number" className="input stat-page-input-border input-number" {...registerNumber("resCost.lust_cost")} id="lust_res_cost"/>
                            </div>
                        </div>
                    </div>
                    <div className="input-container center-element-vertically">
                        <label htmlFor="sloth_res_cost"><img className="stat-icon" src="/Images/sin-affinity/affinity_Sloth_big.webp" alt="sloth-input-resistant-icon" /></label>
                        <div className="resistant-content">
                            <div>
                                <input type="number" className="input stat-page-input-border input-number" {...registerNumber("resCost.sloth_cost")} id="sloth_res_cost"/>
                            </div>
                        </div>
                    </div>
                    <div className="input-container center-element-vertically">
                        <label htmlFor="gluttony_res_cost"><img className="stat-icon" src="/Images/sin-affinity/affinity_Gluttony_big.webp" alt="gluttony-input-resistant-icon" /></label>
                        <div className="resistant-content">
                            <div>
                                <input type="number" className="input stat-page-input-border input-number" {...registerNumber("resCost.gluttony_cost")} id="gluttony_res_cost"/>
                            </div>
                        </div>
                    </div>
                    <div className="input-container center-element-vertically">
                        <label htmlFor="gloom_res_cost"><img className="stat-icon" src="/Images/sin-affinity/affinity_Gloom_big.webp" alt="gloom-input-resistant-icon" /></label>
                        <div className="resistant-content">
                            <div>
                                <input type="number" className="input stat-page-input-border input-number" {...registerNumber("resCost.gloom_cost")} id="gloom_res_cost"/>
                            </div>
                        </div>
                    </div>
                    <div className="input-container center-element-vertically">
                        <label htmlFor="pride_res_cost"><img className="stat-icon" src="/Images/sin-affinity/affinity_Pride_big.webp" alt="pride-input-resistant-icon" /></label>
                        <div className="resistant-content">
                            <div>
                                <input type="number" className="input stat-page-input-border input-number" {...registerNumber("resCost.pride_cost")} id="pride_res_cost"/>
                            </div>
                        </div>
                    </div>
                    <div className="input-container center-element-vertically">
                        <label htmlFor="envy_res_cost"><img className="stat-icon" src="/Images/sin-affinity/affinity_Envy_big.webp" alt="envy-input-resistant-icon" /></label>
                        <div className="resistant-content">
                            <div>
                                <input type="number" className="input stat-page-input-border input-number" {...registerNumber("resCost.envy_cost")} id="envy_res_cost"/>
                            </div>
                        </div>
                    </div>
                </div>
        </AccordionSection>
        <AccordionSection title="Skill Info">
            <div className="input-group-container">
                <div className="input-container">
                    <label className="input-label" htmlFor="skillLabel">Skill label:</label>
                    <input className="input block" type="text" id="skillLabel" {...register("skillLabel")} />
                </div>
            </div>
            <div className="input-group-container">
                <div className="input-container">
                    <label className="input-label" htmlFor="name">Passive name:</label>
                    <input className="input block" type="string" id="name" {...register("name")}/>
                </div>
            </div>
            <div className="input-group-container">
                <div className="input-container">
                    <label className="input-label" htmlFor="skillEffect">Passive description:</label>
                    <p className="effect-guide">To enter a status effect/coin effect/attack effect, put them in square bracket with underscore instead of spacebar like [sinking_deluge]/[coin_1]/[heads_hit] -{">"}
                        <span contentEditable={false} style={{color:"var(--Debuff-color)",textDecoration:"underline"}}><img className='status-icon' src='/Images/status-effect/Sinking_Deluge.webp' alt='sinking_deluge_icon' />Sinking Deluge</span>/
                        <span contentEditable={false}><img className='status-icon' src='/Images/status-effect/Coin_Effect_1.webp' alt='coin-effect-1' /></span>/
                        <span contentEditable={false} style={{color:'#c7ff94'}}>[Heads Hit]</span>
                    </p>
                    <TipTapEditor inputId={"skillEffect"} content={skillEffect} changeHandler={(html)=>setValue("skillEffect",html)} matchList={keyWordList}/>
                </div>
            </div>
        </AccordionSection>

        <button className="main-button delete-skill-button" onClick={()=>setShowConfirm(true)}>
            <DeleteIcon/> Delete the skill
        </button>
        {showConfirm && <ConfirmDialog
            message="Are you sure you want to delete this Passive skill?"
            onConfirm={()=>{setShowConfirm(false); deleteSkill()}}
            onCancel={()=>setShowConfirm(false)}
        />}
    </div>
}
