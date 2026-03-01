import React, { useState } from "react";
import { ReactElement } from "react";
import "../InputPage.css"
import { IDefenseSkill } from "Features/CardCreator/Types/Skills/DefenseSkill/IDefenseSkill";
import DeleteIcon from "Assets/Icons/DeleteIcon";
import ArrowDownIcon from "Assets/Icons/ArrowDownIcon";
import AccordionSection from "Components/AccordionSection/AccordionSection";
import ConfirmDialog from "Components/ConfirmDialog/ConfirmDialog";
import SinAffinityInput from "../Components/SinAffinityInput/SinAffinityInput";
import SkillFrameInput from "../Components/SkillFrameInput/SkillFrameInput";
import DamageTypeInput from "../Components/DamageTypeInput/DamageTypeInput";
import DefenseTypeInput from "../Components/DefenseTypeInput/DefenseTypeInput";
import ChangeInputType from "../Components/ChangeInputType/ChangeInputType";
import TipTapEditor from "../Components/TipTapEditor/TipTapEditor";
import UploadImgBtn from "../Components/UploadImgBtn/UploadImgBtn";
import { compressAndReadImage } from "Features/CardCreator/Utils/CompressAndReadImage";
import { useSkillForm } from "Features/CardCreator/Hooks/useSkillForm";
import DisplayAd from "Components/Ads/DisplayAd/DisplayAd";
import InFeedAd from "Components/Ads/InFeedAd/InFeedAd";

export default function InputDefenseSkillPage({
    index,
    collaspPage}:{
        index:number,
        collaspPage:()=>void}):ReactElement{

    const { register, setValue, watch, deleteSkill, changeSkillType, registerNumber, keyWordList, errors } = useSkillForm<IDefenseSkill>(index)
    const [showConfirm, setShowConfirm] = useState(false)

    const skillAffinity = watch("skillAffinity")
    const skillFrame = watch("skillFrame")
    const skillImage = watch("skillImage")
    const damageType = watch("damageType")
    const defenseType = watch("defenseType")
    const type = watch("type")
    const skillEffect = watch("skillEffect")

    return <div className="input-page input-defense-skill-page" style={{background:`var(--${skillAffinity}-input-page)`}}>
        <div className="input-page-icon-container">
            <div className="collasp-icon" onClick={collaspPage}>
                <ArrowDownIcon></ArrowDownIcon>
            </div>
        </div>
        <DisplayAd />
        <div className="input-group-container">
            <label className="input-label">Change skill:</label>
            <ChangeInputType changeSkillType={changeSkillType} type={type}/>
        </div>

        <AccordionSection title="Skill Affinity and Type">
            <div className="input-group-container">
                <div className="input-container">
                    <p className="input-label">Defense type:</p>
                    <DefenseTypeInput onChangeDefenseType={(newVal)=>setValue("defenseType",newVal)} activeDefenseType={defenseType}/>
                </div>
                <div className="input-container">
                    <p className="input-label">Damage type:</p>
                    <DamageTypeInput onChangeDamageType={(newVal)=>setValue("damageType",newVal)} activeDamageType={damageType} disabled={defenseType!=="Counter"}/>
                </div>
            </div>
            <div className="input-group-container">
                <div className="input-container">
                    <p className="input-label">Sin affinity:</p>
                    <SinAffinityInput onChangeSinAffinity={(newVal)=>setValue("skillAffinity",newVal)} activeSin={skillAffinity}/>
                </div>
            </div>
            {skillAffinity !== "None" &&
                <div className="input-group-container">
                    <div className="input-container">
                        <p className="input-label">Skill frame:</p>
                        <SkillFrameInput onChangeSkillFrame={(newVal)=>setValue("skillFrame",newVal)} activeFrame={skillFrame} skillAffinity={skillAffinity}/>
                    </div>
                </div>
            }
        </AccordionSection>
        <InFeedAd />
        <AccordionSection title="Skill Stats">
            <div className="input-group-container">
                <div className="input-container">
                    <label className="input-label" htmlFor="basePower">Base power:</label>
                    <input className={`input block ${errors.basePower ? "input-error" : ""}`} type="number" id="basePower" {...registerNumber("basePower")}/>
                    {errors.basePower && <p className="input-error-msg">{errors.basePower.message}</p>}
                </div>
                <div className="input-container">
                    <label className="input-label" htmlFor="coinPow">Coin power:</label>
                    <input className={`input block ${errors.coinPow ? "input-error" : ""}`} type="number" id="coinPow" {...registerNumber("coinPow")}/>
                    {errors.coinPow && <p className="input-error-msg">{errors.coinPow.message}</p>}
                </div>
            </div>
            <div className="input-group-container">
                <div className="input-container">
                    <label className="input-label" htmlFor="coinNo">Coin number:</label>
                    <input className={`input block ${errors.coinNo ? "input-error" : ""}`} type="number" id="coinNo" {...registerNumber("coinNo")}/>
                    {errors.coinNo && <p className="input-error-msg">{errors.coinNo.message}</p>}
                </div>
                <div className="input-container">
                    <label className="input-label" htmlFor="skillLevel">Offense level:</label>
                    <input className={`input block ${errors.skillLevel ? "input-error" : ""}`} type="number" id="skillLevel" {...registerNumber("skillLevel")}/>
                    {errors.skillLevel && <p className="input-error-msg">{errors.skillLevel.message}</p>}
                </div>
            </div>
            <div className="input-group-container">
                <div className="input-container">
                    <label className="input-label" htmlFor="skillAmt">Amt:</label>
                    <input className={`input block ${errors.skillAmt ? "input-error" : ""}`} type="number" id="skillAmt" {...registerNumber("skillAmt")}/>
                    {errors.skillAmt && <p className="input-error-msg">{errors.skillAmt.message}</p>}
                </div>
                <div className="input-container">
                    <label className="input-label" htmlFor="atkWeight">Atk weight:</label>
                    <input className={`input block ${errors.atkWeight ? "input-error" : ""}`} type="number" id="atkWeight" {...registerNumber("atkWeight")}/>
                    {errors.atkWeight && <p className="input-error-msg">{errors.atkWeight.message}</p>}
                </div>
            </div>
        </AccordionSection>
        <AccordionSection title="Skill Info">
            <div className="input-group-container">
                <div className="input-container">
                    <label className="input-label" htmlFor="skill-image-input">Skill image: </label>
                    {skillImage &&
                        <div className="input-group-container">
                            <div className="center-element">
                                <img className="preview-skill-image" src={skillImage} alt="custom-skill-img" />
                                <button className="main-button" onClick={()=>setValue("skillImage","")}>
                                    <p className="center-element delete-txt"><DeleteIcon/> Delete</p>
                                </button>
                            </div>
                        </div>
                    }
                    <UploadImgBtn name="skill-image-input" id="skill-image-input" onFileInputChange={async(e)=>{
                        if(e.currentTarget.files && e.currentTarget.files.length>0){
                            const url = await compressAndReadImage(e.currentTarget.files[0])
                            setValue("skillImage",url)
                        }
                    }} btnTxt={"Upload skill img (<= 100kb)"} maxSize={100000}/>
                </div>
            </div>
            <div className="input-group-container">
                <div className="input-container">
                    <label className="input-label" htmlFor="skillLabel">Skill label:</label>
                    <input className="input block" type="text" id="skillLabel" {...register("skillLabel")} />
                </div>
            </div>
            <div className="input-group-container">
                <div className="input-container">
                    <label className="input-label" htmlFor="name">Skill name:</label>
                    <input className="input block" type="text" id="name" {...register("name")} />
                </div>
            </div>
            <div className="input-group-container">
                <div className="input-container">
                    <label className="input-label" htmlFor="skillEffect">Skill description:</label>
                    <p className="effect-guide">To enter a status effect/coin effect/special coin(Unbreakable coin)/attack effect, put them in square bracket with underscore instead of spacebar like [sinking_deluge]/[coin_1]/[coin_1_unbreakable]/[heads_hit] -{">"}
                        <span contentEditable={false} style={{color:"var(--Debuff-color)",textDecoration:"underline"}}><img className='status-icon' src='/Images/status-effect/Sinking_Deluge.webp' alt='sinking_deluge_icon' />Sinking Deluge</span>/
                        <span contentEditable={false}><img className='status-icon' src='/Images/status-effect/Coin_Effect_1.webp' alt='coin-effect-1' /></span>/
                        <span contentEditable={false} className='center-element'><img className='status-icon' src='/Images/status-effect/Coin_Effect_1.webp' alt='coin-effect-1-unbreakable' /> <span contentEditable={false} className='center-element' style={{color:"var(--Neutral-color)",textDecoration:"underline"}}><img className='status-icon' src='/Images/Unbreakable_Coin.webp' alt='unbreakable_coin_icon' />Unbreakable Coin</span></span>
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
            message="Are you sure you want to delete this Defense skill?"
            onConfirm={()=>{setShowConfirm(false); deleteSkill()}}
            onCancel={()=>setShowConfirm(false)}
        />}
    </div>
}
