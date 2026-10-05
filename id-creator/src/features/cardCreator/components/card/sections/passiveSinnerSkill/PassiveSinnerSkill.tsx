import React, { forwardRef } from "react";
import "../SinnerSkill.css"
import "./PassiveSinnerSkill.css"
import { IPassiveSkill } from "features/cardCreator/types/skills/passiveSkill/IPassiveSkill";
import SkillEffect from "../../components/skillEffect/SkillEffect";
import SkillTitle from "../../components/skillTitle/SkillTitle";
import { assetPaths } from "utils/assetPaths";

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
                            {Object.values(reqOwn).some(v=>v>0)&&
                            <div className="req-container">
                                <p>Own: </p>
                                <div className="passive-cost-container">
                                    {Object.entries(reqOwn).filter(([, amount])=>amount>=1).map(([k, amount])=>
                                    <span className="center-element" key={k}>
                                        {amount} <img className="req-sin-icon" src={assetPaths.affinityBig(k[0].toUpperCase()+k.slice(1))} alt={`${k}_icon`} />
                                    </span>)}
                                </div>
                            </div>}

                            {Object.values(reqRes).some(v=>v>0)&&
                            <div className="req-container">
                                <p>Res: </p>
                                <div className="passive-cost-container">
                                    {Object.entries(reqRes).filter(([, amount])=>amount>=1).map(([k, amount])=>
                                    <span className="center-element" key={k}>
                                        {amount} <img className="req-sin-icon" src={assetPaths.affinityBig(k[0].toUpperCase()+k.slice(1))} alt={`${k}_icon`} />
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