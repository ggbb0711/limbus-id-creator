import React, { forwardRef } from "react";
import "../SinnerSkill.css"
import "./PassiveSinnerSkill.css"
import { IPassiveSkill } from "features/cardCreator/types/skills/passiveSkill/IPassiveSkill";
import SkillEffect from "../../components/skillEffect/SkillEffect";
import SkillTitle from "../../components/skillTitle/SkillTitle";
import { assetPaths } from "features/cardCreator/utils/card/assetPaths";
import { getActiveRequirements } from "features/cardCreator/utils/card/getActiveRequirements";

const PassiveSinnerSkill = forwardRef<HTMLDivElement, { passiveSkill: IPassiveSkill }>(({ passiveSkill }, ref) => {
    const {
        skillLabel,
        name,
        skillEffect,
        reqOwn,
        reqRes
    } = passiveSkill;
    const ownRequirements = getActiveRequirements(reqOwn)
    const resRequirements = getActiveRequirements(reqRes)
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
                            {ownRequirements.length>0&&
                            <div className="req-container">
                                <p>Own: </p>
                                <div className="passive-cost-container">
                                    {ownRequirements.map(({key, amount, iconName})=>
                                    <span className="center-element" key={key}>
                                        {amount} <img className="req-sin-icon" src={assetPaths.affinityBig(iconName)} alt={`${key}_icon`} />
                                    </span>)}
                                </div>
                            </div>}

                            {resRequirements.length>0&&
                            <div className="req-container">
                                <p>Res: </p>
                                <div className="passive-cost-container">
                                    {resRequirements.map(({key, amount, iconName})=>
                                    <span className="center-element" key={key}>
                                        {amount} <img className="req-sin-icon" src={assetPaths.affinityBig(iconName)} alt={`${key}_icon`} />
                                    </span>)}
                                </div>
                            </div>}
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