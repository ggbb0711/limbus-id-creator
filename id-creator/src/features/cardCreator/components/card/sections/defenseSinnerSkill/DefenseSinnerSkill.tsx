import React, { forwardRef } from "react";
import "./DefenseSinnerSkill.css";
import { IDefenseSkill } from "features/cardCreator/types/skills/defenseSkill/IDefenseSkill";
import ActiveSkillSection, { SkillFrame, skillImageAlt } from "../activeSkillSection/ActiveSkillSection";
import { defenseLabel } from "features/cardCreator/utils/card/skillIcons";

const DefenseSinnerSkill = forwardRef<HTMLDivElement, { defenseSkill: IDefenseSkill }>(({ defenseSkill }, ref) => {
    const { name, skillAffinity, skillImage, skillFrame, defenseType, showDefenseIcon } = defenseSkill
    return <ActiveSkillSection ref={ref} skill={defenseSkill} splash={
        <div className="skill-splash">
            <SkillFrame skillAffinity={skillAffinity} skillFrame={skillFrame} />
            <div className="splash-container" style={{ backgroundColor: `var(--${skillAffinity})` }}>
                {showDefenseIcon &&
                    <div className="defense-icon-container">
                        <img src={`/Images/defense/defense_${defenseType}.webp`} alt={`${defenseLabel(defenseType)} defense`} />
                    </div>
                }
                {skillImage && <img className="skill-image" src={skillImage} alt={skillImageAlt(name)} crossOrigin="anonymous" />}
            </div>
        </div>
    } />
})
DefenseSinnerSkill.displayName = "DefenseSinnerSkill"
export default DefenseSinnerSkill
