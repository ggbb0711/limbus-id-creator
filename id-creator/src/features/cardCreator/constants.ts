export const SIN_AFFINITIES = ["Wrath", "Lust", "Sloth", "Gluttony", "Gloom", "Pride", "Envy"] as const
export type Sin = typeof SIN_AFFINITIES[number]
export type SinAffinity = Sin | "None"

export type SinKey = Lowercase<Sin>
export const SIN_KEYS = SIN_AFFINITIES.map(sin => sin.toLowerCase() as SinKey)
export type SinRecord<T = number> = Record<SinKey, T>

export const DAMAGE_TYPES = ["Slash", "Pierce", "Blunt"] as const
export type DamageType = typeof DAMAGE_TYPES[number]

export const DEFENSE_TYPES = ["Block", "Dodge", "Counter", "ClashableCounter", "ClashableGuard"] as const
export type DefenseType = typeof DEFENSE_TYPES[number]

export const SKILL_FRAMES = ["1", "2", "3"] as const
export type SkillFrame = typeof SKILL_FRAMES[number]

export const EGO_LEVELS = ["ZAYIN", "TETH", "HE", "WAW", "ALEPH", "UNDEFINED"] as const
export type EgoLevel = typeof EGO_LEVELS[number]

export const PASSIVE_REQUIREMENTS = ["Own", "Res", "None"] as const
export type PassiveRequirement = typeof PASSIVE_REQUIREMENTS[number]

export type SaveMode = "ID" | "EGO"

export const createSinRecord = (value: number): SinRecord =>
    Object.fromEntries(SIN_KEYS.map(key => [key, value])) as SinRecord
