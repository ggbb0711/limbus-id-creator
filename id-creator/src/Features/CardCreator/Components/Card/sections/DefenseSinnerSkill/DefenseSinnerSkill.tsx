import React, { forwardRef } from "react";
import { ReactElement } from "react";
import "../SinnerSkill.css";
import "./DefenseSinnerSkill.css";
import { IDefenseSkill } from "Features/CardCreator/Types/Skills/DefenseSkill/IDefenseSkill";
import SkillTitle from "../../components/SkillTitle/SkillTitle";
import SkillEffect from "../../components/SkillEffect/SkillEffect";

const DefenseSkillSplash = ({skillAffinity,skillImage,defenseType,skillFrame}:{skillAffinity:string,skillImage?:string,defenseType:string,skillFrame:string}):ReactElement => {
    const frameSrc = skillAffinity === "None" ? `/Images/skill-frame/NoneFrame.webp` : `/Images/skill-frame/${skillAffinity}${skillFrame}.webp`
    return(
        <div className="skill-splash">
            <img src={frameSrc} alt={skillAffinity+"Frame"} className={`sin-frame ${skillAffinity==="None"?"none-affinity":""}`} />
            <div className="splash-container" style={{'backgroundColor':`var(--${skillAffinity})`}}>
                <div className="defense-icon-container">
                    <img src={`/Images/defense/defense_${defenseType}.webp`} alt={`defense_${defenseType}`} />
                </div>
                { skillImage && <img className="skill-image" src={skillImage} alt="skill image" crossOrigin="anonymous" />}
            </div>
        </div>
    )
}

const DefenseSinnerSkill = forwardRef<HTMLDivElement, { defenseSkill: IDefenseSkill }>(({ defenseSkill }, ref) => {
    const {
        defenseType,
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
        atkWeight,
        skillFrame,
    } = defenseSkill;

    const printCoins = function (coinNo: number,skillEffect:string): (ReactElement | never)[] {
        if (coinNo > 10) return [<img key={0} src={"/Images/Coin.webp"} alt="coin_icon" />];

        const arr = [];

        for (let i = 0; i < coinNo; i++) {
            if(skillEffect.includes(`alt="coin-effect-${i+1}-unbreakable"`)){
                arr.push(<img key={i} src={"/Images/Unbreakable_Coin.webp"} alt="unbreakable_coin_icon" />);
            }
            else if(skillEffect.includes(`alt="coin-effect-${i+1}-excision"`)){
                arr.push(<img key={i} src={"/Images/Excision_Coin.webp"} alt="excision_coin_icon" />);
            }
            else arr.push(<img key={i} src={"/Images/Coin.webp"} alt="coin_icon" />);
        }
        return arr;
    };

    return (
        <div ref={ref} className="skill-section-container active-skill-container">
            <p className="skill-label">{skillLabel}</p>
            <div className="skill-section">
                <div>
                    <div className="coin-splash-container">
                        <DefenseSkillSplash skillAffinity={skillAffinity} skillImage={skillImage} defenseType={defenseType} skillFrame={skillFrame} />
                        <div className="skill-power">
                            {basePower}
                            {defenseType === "Counter" ? (
                                <img className="damage-type" src={`/Images/attack/attackt_${damageType}.webp`} alt="" />
                            ) : (
                                <img className="damage-type" src={`/Images/defense/defense_${defenseType}.webp`} alt="" />
                            )}
                            {(coinPow < 0 ? "" : "+") + coinPow}
                        </div>
                        <div className="skill-level">
                            {defenseType === "Counter" ? (
                                <img src="/Images/stat/stat_attack.webp" className="skill-level-icon" alt="defense_icon" />
                            ) : (
                                <img src={"/Images/stat/stat_defense.webp"} className="skill-level-icon" alt="attack_icon" />
                            )}

                            <div>
                                <p>Id level</p>
                                <p>{skillLevel < 0 ? skillLevel : "+" + skillLevel}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="sinner-skill-header">
                        {skillAffinity === "None"?<></>:<img className={`sinner-skill-affinity-icon`} src={`/Images/sin-affinity/affinity_${skillAffinity}_big.webp`} alt={`sinner-skill-${skillAffinity}-icon`} />}
                        <div>
                            <div className="coin-container">
                                {printCoins(coinNo,skillEffect)}
                                {coinNo > 10 ? `x ${coinNo}` : ""}
                            </div>
                            <div className="active-skill-title-container">
                                <div className="active-skill-title">
                                    <SkillTitle skillAffinity={skillAffinity} skillTitle={name} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="skill-description">
                        <div className="atk-weight-skill-label-section">
                            <div className="attack-weight">
                                <p>Atk Weight: {atkWeight}</p>
                            </div>
                        </div>
                        <div>
                            <p><span className="skill-amount">Amt.</span> x{skillAmt}</p>
                        </div>
                        <SkillEffect effect={skillEffect} />
                    </div>
                </div>
            </div>
        </div>
    );
});
DefenseSinnerSkill.displayName = "DefenseSinnerSkill";
export default DefenseSinnerSkill;
