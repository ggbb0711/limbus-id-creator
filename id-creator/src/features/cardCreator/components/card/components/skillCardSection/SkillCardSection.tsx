import { ReactElement } from "react";
import { SkillDetail } from "features/cardCreator/types/SkillDetail";
import { getSkillView } from "features/cardCreator/skills/SkillRegistry";

export default function SkillCardSection({skill}:{skill:SkillDetail}):ReactElement{
    return getSkillView(skill.type).renderCard(skill)
}
