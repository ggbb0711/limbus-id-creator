import React, { forwardRef, useCallback } from "react";
import { ReactElement } from "react";
import "./OffenseSinnerSkill.css"
import "../SinnerSkill.css"
import { IOffenseSkill } from "Interfaces/OffenseSkill/IOffenseSkill";
import SkillEffect from "component/CardMakerComponents/Card/components/SkillEffect/SkillEffect";
import OffenseSkillSplash from "component/CardMakerComponents/Card/components/SkillSplash/OffenseSkillSplash/OffenseSkillSplash";
import SkillTitle from "component/CardMakerComponents/Card/components/SkillTitle/SkillTitle";


const OffenseSinnerSkill = forwardRef<HTMLDivElement, { offenseSkill: IOffenseSkill }>(({ offenseSkill }, ref) => {
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
        atkWeight,
    } = offenseSkill;

    const printCoins = useCallback(function (coinNo: number): (ReactElement | never)[] {
        if (coinNo > 5) return [<img key={0} src={"Images/Coin.png"} alt="coin_icon" />];

        const arr = [];

        for (let i = 0; i < coinNo; i++) {
            arr.push(<img key={i} src={"Images/Coin.png"} alt="coin_icon" />);
        }
        return arr;
    }, []);

    return (
        <div className="skill-section-container active-skill-container" >
            <p className="skill-label">{skillLabel}</p>
            <div className="skill-section">
                <div>
                    <div className="coin-splash-container">
                        <OffenseSkillSplash skillAffinity={skillAffinity} skillImage={skillImage} />
                        <div className="skill-power">
                            {basePower}
                            <img className="damage-type" src={`Images/attack/attackt_${damageType}.webp`} alt="" />
                            {(coinPow < 0 ? "" : "+") + coinPow}
                        </div>
                        <div className="skill-level">
                            <img src={"Images/stat/stat_attack.png"} className="skill-level-icon" alt="attack_icon" />
                            <div>
                                <p>Id level</p>
                                <p>{skillLevel < 0 ? skillLevel : "+" + skillLevel}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="sinner-skill-header">
                        {skillAffinity==="None"?<></>:<img className={`sinner-skill-affinity-icon ${skillAffinity}`} src={`Images/sin-affinity/affinity_${skillAffinity}_big.webp`} alt={`sinner-skill-${skillAffinity}-icon`} />}
                        <div>
                            <div className="coin-container">
                                {printCoins(coinNo)}
                                {coinNo > 5 ? `x ${coinNo}` : ""}
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

export default OffenseSinnerSkill;