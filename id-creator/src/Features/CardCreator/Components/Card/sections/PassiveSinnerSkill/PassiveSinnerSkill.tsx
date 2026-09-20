import React, { forwardRef } from "react";
import "../SinnerSkill.css"
import "./PassiveSinnerSkill.css"
import { IPassiveSkill } from "Features/CardCreator/Types/Skills/PassiveSkill/IPassiveSkill";
import SkillEffect from "../../components/SkillEffect/SkillEffect";
import SkillTitle from "../../components/SkillTitle/SkillTitle";

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
                                    {Object.keys(reqOwn).map(k=>{
                                    if(reqOwn[k]<1) return <></>
                                    const affinity_name = k[0]+k.substring(1)
                                    return <span className="center-element" key={k}>
                                        {reqOwn[k]} <img className="req-sin-icon" src={`/Images/sin-affinity/affinity_${affinity_name}_big.webp`} alt={`${k}_icon`} />
                                    </span>})}
                                </div>
                            </div>}

                            {Object.values(reqRes).some(v=>v>0)&&
                            <div className="req-container">
                                <p>Res: </p>
                                <div className="passive-cost-container">
                                    {Object.keys(reqRes).map(k=>{
                                    if(reqRes[k]<1) return <></>
                                    const affinity_name = k[0]+k.substring(1)
                                    return <span className="center-element" key={k}>
                                        {reqRes[k]} <img className="req-sin-icon" src={`/Images/sin-affinity/affinity_${affinity_name}_big.webp`} alt={`${k}_icon`} />
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
PassiveSinnerSkill.displayName = "PassiveSinnerSkill";
export default PassiveSinnerSkill;