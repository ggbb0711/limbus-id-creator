import { IMentalEffect } from "features/cardCreator/types/skills/mentalEffect/IMentalEffect";
import React, { forwardRef } from "react";
import "../SinnerSkill.css"
import "./MentalSinnerEffect.css"
import SkillEffect from "../../components/skillEffect/SkillEffect";
import SkillTitle from "../../components/skillTitle/SkillTitle";

const MentalSinnerEffect = forwardRef<HTMLDivElement, { mentalEffect: IMentalEffect }>(({ mentalEffect }, ref) => {
    const { effect } = mentalEffect;

    return (
        <div className="skill-section-container" ref={ref}>
            <p className="skill-label">SANITY</p>
            <div className="skill-section">
                <div>
                    <img className="sanity-img" src="/Images/Sanity.webp" alt="sanity-icon" />
                </div>
                <div>
                    <div className="mental-skill-header">
                        <SkillTitle skillAffinity="None" skillTitle={"Sanity Effects"} />
                    </div>
                    <div>
                        <SkillEffect effect={effect} />
                    </div>
                </div>
            </div>
        </div>
    );
});
MentalSinnerEffect.displayName = "MentalSinnerEffect";
export default MentalSinnerEffect;