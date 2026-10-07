import React, { forwardRef } from "react";
import { IOffenseSkill } from "features/cardCreator/types/skills/offenseSkill/IOffenseSkill";
import { assetPaths } from "features/cardCreator/utils/card/assetPaths";
import ActiveSkillSection, { SkillFrame } from "../activeSkillSection/ActiveSkillSection";

const OffenseSinnerSkill = forwardRef<HTMLDivElement, { offenseSkill: IOffenseSkill }>(({ offenseSkill }, ref) => {
    const { skillAffinity, skillImage, skillFrame } = offenseSkill
    return <ActiveSkillSection ref={ref} skill={offenseSkill} splash={
        <div className="skill-splash">
            <SkillFrame skillAffinity={skillAffinity} skillFrame={skillFrame} />
            <div className="splash-container" style={{ backgroundColor: `var(--${skillAffinity})` }}>
                {skillImage
                    ? <img className="skill-image" src={skillImage} alt="skill image" crossOrigin="anonymous" />
                    : skillAffinity !== "None" && <img className="placeholder-skill" src={assetPaths.affinityBig(skillAffinity)} alt="skill affinity" />}
            </div>
        </div>
    } />
})
OffenseSinnerSkill.displayName = "OffenseSinnerSkill"
export default OffenseSinnerSkill
