import React, { forwardRef, ReactElement } from "react";
import "../SinnerSkill.css"
import "./PassiveSinnerSkill.css"
import { IPassiveSkill } from "Interfaces/PassiveSkill/IPassiveSkill";
import SkillTitle from "component/Card/components/SkillTitle/SkillTitle";
import SkillEffect from "component/Card/components/SkillEffect/SkillEffect";

const PassiveSinnerSkill = forwardRef<HTMLDivElement, { passiveSkill: IPassiveSkill }>(({ passiveSkill }, ref) => {
    const {
        skillLabel,
        name,
        skillEffect,
        affinity,
        req,
        reqNo,
    } = passiveSkill;

    return (
        <div ref={ref} className="skill-section-container">
            <p className="skill-label">{skillLabel}</p>
            <div className="skill-section">
                <div>
                    <div className="skill-title-req">
                        <div className="active-skill-title">
                            <SkillTitle skillAffinity={"None"} skillTitle={name} />
                        </div>

                        <div className="req-container">
                            {req==="None"||affinity==="None"?<></>:<><p>{req}: {reqNo}</p><img className={`req-sin-icon`} src={`Images/sin-affinity/affinity_${affinity}_big.webp`} /></>}
                            
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

export default PassiveSinnerSkill;