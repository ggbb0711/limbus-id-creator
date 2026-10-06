import React, { ReactElement, forwardRef } from "react";
import { SinRecord } from "features/cardCreator/constants";
import "../SinnerSkill.css"
import "./PassiveSinnerSkill.css"
import { IPassiveSkill } from "features/cardCreator/types/skills/passiveSkill/IPassiveSkill";
import SkillEffect from "../../components/skillEffect/SkillEffect";
import SkillTitle from "../../components/skillTitle/SkillTitle";
import { assetPaths } from "features/cardCreator/utils/card/assetPaths";
import { getActiveRequirements } from "features/cardCreator/utils/card/getActiveRequirements";

function RequirementRow({ label, requirements }: { label: string, requirements: SinRecord }): ReactElement | null {
    const active = getActiveRequirements(requirements)
    if (active.length === 0) return null
    return <div className="req-container">
        <p>{label}: </p>
        <div className="passive-cost-container">
            {active.map(({ key, amount, iconName }) =>
                <span className="center-element" key={key}>
                    {amount} <img className="req-sin-icon" src={assetPaths.affinityBig(iconName)} alt={`${key}_icon`} />
                </span>)}
        </div>
    </div>
}

const PassiveSinnerSkill = forwardRef<HTMLDivElement, { passiveSkill: IPassiveSkill }>(({ passiveSkill }, ref) => {
    const {
        skillLabel,
        name,
        skillEffect,
        reqOwn,
        reqRes
    } = passiveSkill;
    return (
        <div className="skill-section-container" ref={ref}>
            <p className="skill-label">{skillLabel}</p>
            <div className="skill-section">
                <div>
                    <div className="skill-title-req">
                        <div className="active-skill-title passive-skill-title">
                            <SkillTitle skillAffinity={"None"} skillTitle={name} />
                        </div>

                        <div>
                            <RequirementRow label="Own" requirements={reqOwn} />
                            <RequirementRow label="Res" requirements={reqRes} />
                        </div>
                        
                    </div>
                    <div className="skill-description">
                        <SkillEffect effect={skillEffect} />
                    </div>
                </div>

            </div>
        </div>
    );
});
PassiveSinnerSkill.displayName = "PassiveSinnerSkill";
export default PassiveSinnerSkill;