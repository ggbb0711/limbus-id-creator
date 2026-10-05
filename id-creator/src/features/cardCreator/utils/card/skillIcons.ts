import { DefenseType } from "features/cardCreator/constants"
import { IOffenseSkill } from "features/cardCreator/types/skills/offenseSkill/IOffenseSkill"
import { IDefenseSkill } from "features/cardCreator/types/skills/defenseSkill/IDefenseSkill"

export interface IconSource {
    src: string
    alt: string
}

type ActiveSkill = IOffenseSkill | IDefenseSkill

const isCounter = (defenseType: DefenseType) => defenseType === "Counter" || defenseType === "ClashableCounter"

export const isAttackingSkill = (skill: ActiveSkill): boolean =>
    skill.type === "OffenseSkill" || isCounter(skill.defenseType)

const attackIcon = (skill: ActiveSkill): IconSource =>
    ({ src: `/Images/attack/attackt_${skill.damageType}.webp`, alt: `${skill.damageType}_icon` })

export function getSkillPowerIcon(skill: ActiveSkill): IconSource {
    if (skill.type === "OffenseSkill" || isCounter(skill.defenseType)) return attackIcon(skill)
    const defense = skill.defenseType === "ClashableGuard" ? "Block" : skill.defenseType
    return { src: `/Images/defense/defense_${defense}.webp`, alt: `${defense}_icon` }
}

export function getSkillLevelIcon(skill: ActiveSkill): IconSource {
    return isAttackingSkill(skill)
        ? { src: "/Images/stat/stat_attack.webp", alt: "attack_icon" }
        : { src: "/Images/stat/stat_defense.webp", alt: "defense_icon" }
}
