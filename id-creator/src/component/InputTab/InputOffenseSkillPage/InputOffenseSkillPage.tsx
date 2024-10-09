import React from "react";
import { ReactElement } from "react";
import "../InputPage.css"
import useInputs from "component/util/useInputs";
import { IOffenseSkill } from "Interfaces/OffenseSkill/IOffenseSkill";
import UploadImgBtn from "../Components/UploadImgBtn/UploadImgBtn";
import ChangeInputType from "../Components/ChangeInputType/ChangeInputType";
import SinAffinityInput from "../Components/SinAffinityInput/SinAffinityInput";
import DamageTypeInput from "../Components/DamageTypeInput/DamageTypeInput";
import EditableAutoCorrect from "../Components/EditableAutoCorrectInput/EditableAutoCorrect";
import MainButton from "utils/MainButton/MainButton";
import Delete_icon from "Icons/Delete_icon";
import Arrow_down_icon from "Icons/Arrow_down_icon";

export default function InputOffenseSkillPage({
        offenseSkill,
        keyWordList,
        changeSkill,
        changeSkillType,
        deleteSkill,
        collaspPage}:{
            offenseSkill:IOffenseSkill,
            keyWordList:{[key:string]:string},
            changeSkill:(newInput:{[type:string]:string|number})=>void,
            changeSkillType:(newVal:string)=>void,
            deleteSkill:(skillID:string)=>void,
            collaspPage:()=>void}):ReactElement{
    const {onChangeFileWithName,onChangeDropDownMenu,onChangeInput,onChangeAutoCorrectInput}=useInputs(offenseSkill as any,changeSkill)

    const{
        skillLevel,
        skillAmt,
        skillImage,
        atkWeight,
        damageType,
        name,
        skillAffinity,
        basePower,
        coinNo,
        coinPow,
        skillEffect,
        skillLabel,
        type,
        inputId
    }=offenseSkill
    

    return <div className="input-page input-offense-skill-page" style={{background:`var(--${skillAffinity}-input-page)`}}>
        <div className="input-page-icon-container">
            <div className="collasp-icon" onClick={collaspPage}>
                <Arrow_down_icon></Arrow_down_icon>
            </div>
            <div className="delete-icon" onClick={()=>deleteSkill(inputId)}>
                <Delete_icon></Delete_icon>
            </div>
        </div>
        <ChangeInputType changeSkillType={changeSkillType} type={type}/>
        {skillImage?
            <div className="input-group-container">
                <div className="center-element-vertically">
                    <img className="preview-skill-image" src={skillImage} alt="custom-skill-img" />
                    <MainButton component={<p className="center-element delete-txt"><Delete_icon/> Delete</p>} clickHandler={()=>changeSkill({...offenseSkill,skillImage:""})} btnClass="main-button"/>
                </div>
            </div>
        :<></>}
        <div className="input-group-container">
            <UploadImgBtn onFileInputChange={onChangeFileWithName("skillImage")} btnTxt={"Upload skill img (<= 100kb)"} maxSize={100000}/>
        </div>
        <div className="input-group-container">
            <div className="input-container">
                <p className="input-label">Damage type:</p>
                <DamageTypeInput onChangeDamageType={onChangeDropDownMenu("damageType")} activeDamageType={damageType}/>
            </div>
        </div>

        <div className="input-group-container">
            <div className="input-container">
                <p className="input-label">Sin affinity:</p>
                <SinAffinityInput onChangeSinAffinity={onChangeDropDownMenu("skillAffinity")} activeSin={skillAffinity}/>
            </div>
        </div>
        <div className="input-group-container">
            <div className="input-container">
                <label className="input-label" htmlFor="basePower">Base power:</label>
                <input className="input block" type="number" name="basePower" id="basePower" value={basePower} onChange={onChangeInput()}/>
            </div>
            <div className="input-container">
                <label className="input-label" htmlFor="coinPow">Coin power:</label>
                <input className="input block" type="number" name="coinPow" id="coinPow" value={coinPow} onChange={onChangeInput()}/>
            </div>

        </div>
        <div className="input-group-container">
            <div className="input-container">
                <label className="input-label" htmlFor="coinNo">Coin number:</label>
                <input className="input block" type="number" name="coinNo" id="coinNo" value={coinNo} onChange={onChangeInput()}/>
            </div>
            <div className="input-container">
                <label className="input-label" htmlFor="skillLevel">Offense level:</label>
                <input className="input block" type="number" name="skillLevel" id="skillLevel" value={skillLevel} onChange={onChangeInput()}/>
            </div>
        </div>
        <div className="input-group-container">
            <div className="input-container">
                <label className="input-label" htmlFor="atkWeight">Atk weight:</label>
                <input className="input block" type="number" name="atkWeight" id="atkWeight" value={atkWeight} onChange={onChangeInput()}/>
            </div>
            <div className="input-container">
                <label className="input-label" htmlFor="skillAmt">Amt:</label>
                <input className="input block" type="number" name="skillAmt" id="skillAmt" value={skillAmt} onChange={onChangeInput()}/>
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
                <label className="input-label" htmlFor="name">Skill name:</label>
                <input className="input block" type="text" name="name" id="name" value={name} onChange={onChangeInput()} />
            </div>
        </div>
        <div className="input-group-container">
            <div className="input-container">
                <label className="input-label" htmlFor={`skillEffect_${inputId}`}>Skill description:</label>
                <p className="effect-guide">To enter a status effect/coin effect/attack effect, put them in square bracket with underscore instead of spacebar like [sinking_deluge]/[coin_1]/[heads_hit] -{">"} 
                    <span contentEditable={false} style={{color:"var(--Debuff-color)",textDecoration:"underline"}}><img className='status-icon' src='Images/status-effect/Sinking_Deluge.png' alt='sinking_deluge_icon' />Sinking Deluge</span>/
                    <span contentEditable={false}><img className='status-icon' src='Images/status-effect/Coin_Effect_1.png' alt='coin-effect-1' /></span>/
                    <span contentEditable={false} style={{color:'#c7ff94'}}>[Heads Hit]</span>
                </p>
                <EditableAutoCorrect inputId={`skillEffect_${inputId}`} content={skillEffect} changeHandler={onChangeAutoCorrectInput(keyWordList,"skillEffect")} matchList={keyWordList} />            
            </div>
        </div>
    </div>
}