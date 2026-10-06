import { z } from "zod"
import { EGO_LEVELS, SinRecord, createSinRecord, SIN_KEYS } from "features/cardCreator/constants"
import { ICardInfoBase } from "features/cardCreator/types/ICardInfoBase"
import { IEgoInfo, createEgoInfo } from "features/cardCreator/types/IEgoInfo"
import { IIdInfo, createIdInfo } from "features/cardCreator/types/IIdInfo"
import { ISaveFile } from "features/cardCreator/types/ISaveFile"
import { SkillDetail } from "features/cardCreator/types/SkillDetail"
import { getSkillData, isKnownSkillType } from "features/cardCreator/skills/skillData"

export const CURRENT_SCHEMA_VERSION = 2

type Raw = Record<string, unknown>

const isRecord = (value: unknown): value is Raw => typeof value === "object" && value !== null && !Array.isArray(value)

export function fixAssetPath(path: unknown, fallback: string): string {
    if (typeof path !== "string" || !path) return fallback
    const rooted = path.startsWith("Images") ? `/${path}` : path
    return rooted.startsWith("/Images") ? rooted.replace(/\.png$/, ".webp") : rooted
}

function withoutIndex(skill: Raw): Raw {
    const copy = { ...skill }
    delete copy.index
    return copy
}

export function migrateSkills(raw: unknown): SkillDetail[] {
    if (!Array.isArray(raw)) return []
    return raw
        .filter((skill): skill is Raw & { type: SkillDetail["type"] } => isRecord(skill) && isKnownSkillType(skill.type))
        .map(skill => getSkillData(skill.type).migrate(withoutIndex(skill) as Partial<SkillDetail>))
}

const text = (fallback: string) => z.string().catch(fallback)

const num = (fallback: number) => z.number().catch(fallback)

const assetPath = (fallback: string) => z.unknown().optional().transform(path => fixAssetPath(path, fallback))

const sinRecord = (fallback: SinRecord) =>
    z.object(Object.fromEntries(SIN_KEYS.map(key => [key, num(fallback[key])])) as Record<keyof SinRecord, ReturnType<typeof num>>).catch(fallback)

const baseShape = (defaults: ICardInfoBase) => ({
    title: text(defaults.title),
    name: text(defaults.name),
    splashArt: text(defaults.splashArt),
    splashArtScale: num(defaults.splashArtScale),
    splashArtTranslation: z.object({
        x: num(defaults.splashArtTranslation.x),
        y: num(defaults.splashArtTranslation.y),
    }).catch(defaults.splashArtTranslation),
    sinnerColor: text(defaults.sinnerColor),
    sinnerIcon: assetPath(defaults.sinnerIcon),
    skillDetails: z.array(z.unknown()).transform(migrateSkills).catch(defaults.skillDetails),
})

const versioned = { localSaveId: 1, schemaVersion: CURRENT_SCHEMA_VERSION } as const

function parseOrDefaults<T>(schema: z.ZodType<T>, raw: unknown): T {
    const result = schema.safeParse(raw)
    return result.success ? result.data : schema.parse({})
}

export function migrateIdInfo(raw: unknown): IIdInfo {
    const defaults = createIdInfo()
    const schema = z.object({
        ...baseShape(defaults),
        traits: z.array(z.unknown()).transform(traits => traits.filter((trait): trait is string => typeof trait === "string")).catch([]),
        hp: num(defaults.hp),
        minSpeed: num(defaults.minSpeed),
        maxSpeed: num(defaults.maxSpeed),
        staggerResist: text(defaults.staggerResist),
        defenseLevel: num(defaults.defenseLevel),
        slashResistant: num(defaults.slashResistant),
        pierceResistant: num(defaults.pierceResistant),
        bluntResistant: num(defaults.bluntResistant),
        rarity: assetPath(defaults.rarity),
    })
    return { ...parseOrDefaults(schema, raw), ...versioned }
}

export function migrateEgoInfo(raw: unknown): IEgoInfo {
    const defaults = createEgoInfo()
    const schema = z.object({
        ...baseShape(defaults),
        sanityCost: num(defaults.sanityCost),
        sinResistant: sinRecord(createSinRecord(1)),
        sinCost: sinRecord(createSinRecord(0)),
        egoLevel: z.enum(EGO_LEVELS).catch(defaults.egoLevel),
    })
    return { ...parseOrDefaults(schema, raw), ...versioned }
}

const optionalText = z.string().optional().catch(undefined)

const saveFileSchema = z.object({
    id: text(""),
    name: optionalText,
    saveName: optionalText,
    saveTime: text(""),
    updateTime: text(""),
    previewImg: text(""),
    saveInfo: z.unknown().optional(),
}).transform(({ name, saveName, ...rest }) => ({ ...rest, name: name ?? saveName ?? "Untitled" }))

export function migrateSaveFile<T>(raw: unknown, migrateInfo: (info: unknown) => T): ISaveFile<T> {
    const { saveInfo, ...file } = parseOrDefaults(saveFileSchema, raw)
    return { ...file, saveInfo: migrateInfo(saveInfo) }
}
