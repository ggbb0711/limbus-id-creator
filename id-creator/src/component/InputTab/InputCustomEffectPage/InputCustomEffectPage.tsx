import { useIdInfoContext } from "component/context/IdInfoContext";
import useSkillInput from "component/IdCard/util/useSkillInput";
import { ICustomEffect } from "Interfaces/CustomEffect/ICustomEffect";
import React from "react";
import { ReactElement } from "react";
import ChangeInputType from "../Components/ChangeInputType/ChangeInputType";
import UploadImgBtn from "../Components/UploadImgBtn/UploadImgBtn";
import "../InputPage.css"
import { useStatusEffectContext } from "component/context/StatusEffectContext";
import EditableAutoCorrect from "../Components/EditableAutoCorrectInput/EditableAutoCorrect";

export default function InputCustomEffectPage({index}:{index:number}):ReactElement{
    const {idInfoValue} = useIdInfoContext()
    const {statusEffect} = useStatusEffectContext()
    const {onChangeInput,onChangeFileWithName,changeSkillType,onChangeAutoCorrectInput}=useSkillInput(index)

    const{
        name,
        effectColor,
        effect,
        type
    } = idInfoValue.skillDetails[index] as ICustomEffect
    
    return <div className="input-page">
        <ChangeInputType changeSkillType={changeSkillType} type={type}/>
        <div className="input-group-container">
            <div className="input-container center-element">
                <p>Upload effect img: </p>
                <UploadImgBtn onFileInputChange={onChangeFileWithName("customImg")}/>
            </div>
            <div className="input-container center-element">
                <label htmlFor="effectColor">Choose the effect color: </label>
                <input type="color" name="effectColor" id="effectColor" value={effectColor} onChange={onChangeInput()}/>
            </div>
        </div>
        <div className="input-group-container">
            <div className="input-container">
                <label className="input-label" htmlFor="name">Effect name:</label>
                <input className="input block" style={{color:effectColor}} type="text" name="name" id="name" value={name} onChange={onChangeInput()} />
            </div>
        </div>
        <div className="input-group-container">
            <div className="input-container">
                <label className="input-label" htmlFor="effect">Effect description:</label>
                <p className="effect-guide">To enter a status effect/coin effect/attack effect, put them in square bracket with underscore instead of spacebar like [sinking_deluge]/[coin_1]/[heads_hit] -{">"} 
                    <span contentEditable={false} style={{color:"var(--Debuff-color)",textDecoration:"underline"}}><img className='status-icon' src='Images/status-effect/Sinking_Deluge.png' alt='sinking_deluge_icon' />Sinking Deluge</span>/
                    <span contentEditable={false}><img className='status-icon' src='Images/status-effect/Coin_Effect_1.png' alt='coin-effect-1' /></span>/
                    <span contentEditable={false} style={{color:'#c7ff94'}}>[Heads Hit]</span>
                </p>
                <EditableAutoCorrect inputId={"effect"} content={effect} changeHandler={onChangeAutoCorrectInput("effect")} matchList={statusEffect}/>              
            </div>
        </div>
    </div>
}