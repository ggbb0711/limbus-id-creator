import OffenseSkillSplash from "component/IdCard/components/SkillSplash/OffenseSkillSplash/OffenseSkillSplash";
import SkillTitle from "component/IdCard/components/SkillTitle/SkillTitle";
import React, { useCallback } from "react";
import { ReactElement } from "react";
import "./OffenseSinnerSkill.css"
import "../SinnerSkill.css"
import { useIdInfoContext } from "component/context/IdInfoContext";
import useSkillInput from "component/IdCard/util/useSkillInput";
import SkillEffect from "component/IdCard/components/SkillEffect/SkillEffect";
import { IOffenseSkill } from "Interfaces/OffenseSkill/IOffenseSkill";


export default function OffenseSinnerSkill({skillIndex,preview}:{skillIndex:number,preview:boolean}):ReactElement{
    const {idInfoValue}=useIdInfoContext()
    const {onChangeFile,onChangeInput,onChangeAutoCorrectInput,onChangeDropDownMenu,deleteInput,changeSkillType}=useSkillInput(skillIndex)
    const {
        damageType,
        name,
        skillAffinity,
        basePower,
        coinNo,
        coinPow,
        skillImage,
        skillEffect,
        skillLabel,
        skillLevel,
        skillAmt,
        atkWeight,}=(idInfoValue.skillDetails[skillIndex] as IOffenseSkill)

    
    const printCoins=useCallback(function(coinNo:number):(ReactElement|never)[]{
        if(coinNo>5) return [<img key={0} src={"Images/Coin.png"} alt="coin_icon"/>]
        
        const arr=[]
        
        for (let i = 0; i < coinNo; i++) {
            arr.push(<img key={i} src={"Images/Coin.png"} alt="coin_icon"/>)
        }
        return arr
    },[])

    
    return(
        <div className="skill-section-container active-skill-container" style={{zIndex:idInfoValue.skillDetails.length-skillIndex+1}}>
            <p className="skill-label">{skillLabel}</p>
            <div className="skill-section">
                <div>
                    <div className="coin-splash-container">
                        <OffenseSkillSplash skillAffinity={skillAffinity} skillImage={skillImage}/>
                        <div className="skill-power">
                            {basePower}
                            <img className="damage-type" src={`Images/attack/attackt_${damageType}.webp`} alt="" /> 
                            {(coinPow<0?"":"+")+coinPow}
                        </div>
                        <div className="skill-level">
                            <img src={"Images/stat/stat_attack.png"} className="skill-level-icon" alt="attack_icon" />
                            <div>
                                <p>Id level</p>
                                <p>{(skillLevel<0)?skillLevel:"+"+skillLevel}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="sinner-skill-header">
                        <img className={`sinner-skill-affinity-icon ${skillAffinity==="None"?"hidden":""}`} src={`Images/sin-affinity/affinity_${skillAffinity}_big.webp`} alt={`sinner-skill-${skillAffinity}-icon`} />
                        <div>
                            <div className="coin-container">
                                {printCoins(coinNo)}
                                {(coinNo>5?`x ${coinNo}`:"")}
                            </div>
                            <div className="active-skill-title-container">
                                <div className="active-skill-title">
                                    <SkillTitle skillAffinity={skillAffinity} skillTitle={name} preview={preview} onInputChange={onChangeInput("name")}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="skill-description">
                        <div className="atk-weight-skill-label-section">
                            <div className="attack-weight">
                                <p>Atk Weight: {preview?atkWeight:<input type="number" className={`small-number-input`} name="atkWeight" style={{backgroundColor:`var(--${skillAffinity})`}} value={atkWeight} onChange={onChangeInput()}/>}</p>
                            </div>
                        </div>
                        <div>
                            <p><span className="skill-amount">Amt.</span> x{skillAmt}</p>
                        </div>
                        <SkillEffect effect={skillEffect} preview={preview} onInputChange={onChangeAutoCorrectInput("skillEffect")}/>
                    </div>
                </div>
            </div>
        </div>
    )
}
