import { SinRecord, createSinRecord, SIN_KEYS } from "features/cardCreator/constants"
import { ICardInfoBase, ISplashArtTranslation } from "features/cardCreator/types/ICardInfoBase"
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

function migrateSinRecord(raw: unknown, fallback: SinRecord): SinRecord {
    if (!isRecord(raw)) return fallback
    return Object.fromEntries(SIN_KEYS.map(key => [key, typeof raw[key] === "number" ? raw[key] : fallback[key]])) as SinRecord
}

function migrateBase<T extends ICardInfoBase>(raw: Raw, defaults: T): T {
    const translation = isRecord(raw.splashArtTranslation) ? raw.splashArtTranslation : {}
    return {
        ...defaults,
        ...raw,
        splashArtTranslation: { ...defaults.splashArtTranslation, ...translation } as ISplashArtTranslation,
        sinnerIcon: fixAssetPath(raw.sinnerIcon, defaults.sinnerIcon),
        skillDetails: Array.isArray(raw.skillDetails) ? migrateSkills(raw.skillDetails) : defaults.skillDetails,
        localSaveId: 1,
        schemaVersion: CURRENT_SCHEMA_VERSION,
    }
}

export function migrateIdInfo(raw: unknown): IIdInfo {
    const source = isRecord(raw) ? raw : {}
    const defaults = createIdInfo()
    return {
        ...migrateBase(source, defaults),
        traits: Array.isArray(source.traits) ? source.traits.filter((trait): trait is string => typeof trait === "string") : [],
        rarity: fixAssetPath(source.rarity, defaults.rarity),
    }
}

export function migrateEgoInfo(raw: unknown): IEgoInfo {
    const source = isRecord(raw) ? raw : {}
    const defaults = createEgoInfo()
    return {
        ...migrateBase(source, defaults),
        sinCost: migrateSinRecord(source.sinCost, createSinRecord(0)),
        sinResistant: migrateSinRecord(source.sinResistant, createSinRecord(1)),
    }
}

export function migrateSaveFile<T>(raw: unknown, migrateInfo: (info: unknown) => T): ISaveFile<T> {
    const source = isRecord(raw) ? raw : {}
    const name = typeof source.name === "string" ? source.name : typeof source.saveName === "string" ? source.saveName : "Untitled"
    return {
        id: typeof source.id === "string" ? source.id : "",
        name,
        saveTime: typeof source.saveTime === "string" ? source.saveTime : "",
        updateTime: typeof source.updateTime === "string" ? source.updateTime : "",
        previewImg: typeof source.previewImg === "string" ? source.previewImg : "",
        saveInfo: migrateInfo(source.saveInfo),
    }
}
