export const SIN_AFFINITIES = ["Wrath", "Lust", "Sloth", "Gluttony", "Gloom", "Pride", "Envy"] as const
export type Sin = typeof SIN_AFFINITIES[number]
export type SinAffinity = Sin | "None"

export type SinKey = Lowercase<Sin>
export const toSinKey = (sin: Sin): SinKey => sin.toLowerCase() as SinKey
export const SIN_KEYS = SIN_AFFINITIES.map(toSinKey)
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

export interface IconOption {
    src: string
    alt: string
}

export interface SinnerOption extends IconOption {
    color: string
}

export const SINNER_DEFINITIONS = [
    { key: "Yi_Sang", tagName: "Yi Sang", label: "Yi Sang", colorVar: "--Yi-Sang-color" },
    { key: "Faust", tagName: "Faust", label: "Faust", colorVar: "--Faust-color" },
    { key: "Don_Quixote", tagName: "Don Quixote", label: "Don Quixote", colorVar: "--Don-color" },
    { key: "Ryoshu", tagName: "Ryoshu", label: "Ryōshū", colorVar: "--Ryōshū-color" },
    { key: "Meursault", tagName: "Meursault", label: "Meursault", colorVar: "--Meursault-color" },
    { key: "Hong_Lu", tagName: "Hong Lu", label: "Hong Lu", colorVar: "--Hong-Lu-color" },
    { key: "Heathcliff", tagName: "Heathcliff", label: "Heathcliff", colorVar: "--Heathcliff-color" },
    { key: "Ishmael", tagName: "Ishmael", label: "Ishmael", colorVar: "--Ishmael-color" },
    { key: "Sinclair", tagName: "Sinclair", label: "Sinclair", colorVar: "--Sinclair-color" },
    { key: "Rodion", tagName: "Rodion", label: "Rodion", colorVar: "--Rodya-color" },
    { key: "Outis", tagName: "Outis", label: "Outis", colorVar: "--Outis-color" },
    { key: "Gregor", tagName: "Gregor", label: "Gregor", colorVar: "--Gregor-color" },
] as const

export type SinnerKey = typeof SINNER_DEFINITIONS[number]["key"]

export const sinnerIconSrc = (key: SinnerKey) => `/Images/sinner-icon/${key}_Icon.webp`

export const SINNERS: readonly SinnerOption[] = SINNER_DEFINITIONS.map(({ key, colorVar }) => ({
    src: sinnerIconSrc(key),
    alt: `${key}_Icon.webp`,
    color: `var(${colorVar})`,
}))

export const RARITIES: readonly IconOption[] = [1, 2, 3].map(rank => ({
    src: `/Images/rarity/IDNumber${rank}.webp`,
    alt: `rarity-icon-${rank}.webp`,
}))
