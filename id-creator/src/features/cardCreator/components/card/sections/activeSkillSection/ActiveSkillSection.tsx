import React, { ReactElement, ReactNode, forwardRef } from "react";
import "../SinnerSkill.css"
import { IOffenseSkill } from "features/cardCreator/types/skills/offenseSkill/IOffenseSkill";
import { IDefenseSkill } from "features/cardCreator/types/skills/defenseSkill/IDefenseSkill";
import SkillTitle from "../../components/skillTitle/SkillTitle";
import SkillEffect from "../../components/skillEffect/SkillEffect";
import { getSkillLevelIcon, getSkillPowerIcon } from "features/cardCreator/utils/card/skillIcons";
import formatSigned from "features/cardCreator/utils/card/formatSigned";
import { assetPaths } from "features/cardCreator/utils/card/assetPaths";
import CoinRow from "./CoinRow";

interface ActiveSkillSectionProps {
    skill: IOffenseSkill | IDefenseSkill
    splash: ReactNode
}

export const SkillFrame = ({ skillAffinity, skillFrame }: { skillAffinity: string, skillFrame: string }): ReactElement =>
    <img src={assetPaths.skillFrame(skillAffinity, skillFrame)} alt={skillAffinity + "Frame"} className={`sin-frame ${skillAffinity === "None" ? "none-affinity" : ""}`} />

const ActiveSkillSection = forwardRef<HTMLDivElement, ActiveSkillSectionProps>(({ skill, splash }, ref) => {
    const { name, skillAffinity, basePower, coinNo, coinPow, skillEffect, skillLabel, skillLevel, skillAmt, atkWeight } = skill
    const powerIcon = getSkillPowerIcon(skill)
    const levelIcon = getSkillLevelIcon(skill)

    return (
        <div className="skill-section-container active-skill-container" ref={ref}>
            <p className="skill-label">{skillLabel}</p>
            <div className="skill-section">
                <div>
                    <div className="coin-splash-container">
                        {splash}
                        <div className="skill-power">
                            {basePower}
                            <img className="damage-type" src={powerIcon.src} alt={powerIcon.alt} />
                            {formatSigned(coinPow)}
                        </div>
                        <div className="skill-level">
                            <img src={levelIcon.src} className="skill-level-icon" alt={levelIcon.alt} />
                            <div>
                                <p>Id level</p>
                                <p>{formatSigned(skillLevel)}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="sinner-skill-header">
                        {skillAffinity !== "None" && <img className="sinner-skill-affinity-icon" src={assetPaths.affinityBig(skillAffinity)} alt={`sinner-skill-${skillAffinity}-icon`} />}
                        <div>
                            <CoinRow coinNo={coinNo} skillEffect={skillEffect} />
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
    )
})
ActiveSkillSection.displayName = "ActiveSkillSection"
export default ActiveSkillSection
