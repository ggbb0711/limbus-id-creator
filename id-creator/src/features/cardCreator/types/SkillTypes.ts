export const SKILL_TYPES = ["OffenseSkill", "DefenseSkill", "PassiveSkill", "CustomEffect", "MentalEffect"] as const
export type SkillType = typeof SKILL_TYPES[number]
