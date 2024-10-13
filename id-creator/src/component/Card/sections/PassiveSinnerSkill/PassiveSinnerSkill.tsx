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
        ownCost,
        resCost
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
                            {Object.values(ownCost).some(v=>v>0)&&
                            <div className="req-container">
                                <p>Own: </p>
                                <div className="passive-cost-container">
                                    {Object.keys(ownCost).map(k=>{
                                    if(ownCost[k]<1) return <></>
                                    const affinity_name = k.replace("_cost","")[0]+k.replace("_cost","").substring(1)
                                    return <span className="center-element">
                                        {ownCost[k]} <img className="req-sin-icon" src={`Images/sin-affinity/affinity_${affinity_name.replace("_cost","")}_big.webp`} alt={`${k}_icon`} />
                                    </span>})}
                                </div>
                            </div>}

                            {Object.values(resCost).some(v=>v>0)&&
                            <div className="req-container">
                                <p>Res: </p>
                                <div className="passive-cost-container">
                                    {Object.keys(resCost).map(k=>{
                                    if(resCost[k]<1) return <></>
                                    const affinity_name = k.replace("_cost","")[0]+k.replace("_cost","").substring(1)
                                    return <span className="center-element">
                                        {resCost[k]} <img className="req-sin-icon" src={`Images/sin-affinity/affinity_${affinity_name.replace("_cost","")}_big.webp`} alt={`${k}_icon`} />
                                    </span>})}
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

export default PassiveSinnerSkill;