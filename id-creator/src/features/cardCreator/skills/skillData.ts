import { SkillDetail, SkillOfType } from "features/cardCreator/types/SkillDetail"
import { SKILL_TYPES, SkillType } from "features/cardCreator/types/SkillTypes"
import { createOffenseSkill } from "features/cardCreator/types/skills/offenseSkill/IOffenseSkill"
import { createDefenseSkill } from "features/cardCreator/types/skills/defenseSkill/IDefenseSkill"
import { createPassiveSkill } from "features/cardCreator/types/skills/passiveSkill/IPassiveSkill"
import { createCustomEffect } from "features/cardCreator/types/skills/customEffect/ICustomEffect"
import { createMentalEffect } from "features/cardCreator/types/skills/mentalEffect/IMentalEffect"

export interface SkillImage<K extends SkillType> {
    read(skill: SkillOfType<K>): string
    clear(skill: SkillOfType<K>): SkillOfType<K>
}

export interface SkillData<K extends SkillType> {
    readonly type: K
    label: string
    addLabel: string
    icon: string
    iconAlt: string
    create(): SkillOfType<K>
    migrate(raw: Partial<SkillOfType<K>>): SkillOfType<K>
    tabIcon(skill: SkillOfType<K>): string
    image?: SkillImage<K>
}

export const SKILL_DATA = {
    OffenseSkill: {
        type: "OffenseSkill",
        label: "Offensive skill",
        addLabel: "Add offense skill",
        icon: "/Images/stat/stat_attack.webp",
        iconAlt: "attk_icon",
        create: () => createOffenseSkill(),
        migrate: raw => createOffenseSkill({ ...raw, skillFrame: raw.skillFrame || "1" }),
        tabIcon: () => "/Images/stat/stat_attack.webp",
        image: {
            read: skill => skill.skillImage,
            clear: skill => ({ ...skill, skillImage: "" }),
        },
    },
    DefenseSkill: {
        type: "DefenseSkill",
        label: "Defense skill",
        addLabel: "Add defense skill",
        icon: "/Images/stat/stat_defense.webp",
        iconAlt: "defense_icon",
        create: () => createDefenseSkill(),
        migrate: raw => createDefenseSkill({ ...raw, skillFrame: raw.skillFrame || "1" }),
        tabIcon: () => "/Images/stat/stat_defense.webp",
        image: {
            read: skill => skill.skillImage,
            clear: skill => ({ ...skill, skillImage: "" }),
        },
    },
    PassiveSkill: {
        type: "PassiveSkill",
        label: "Passive skill",
        addLabel: "Add passive skill",
        icon: "/Images/status-effect/Aggro.webp",
        iconAlt: "passive_icon",
        create: () => createPassiveSkill(),
        migrate: raw => createPassiveSkill(raw),
        tabIcon: () => "/Images/status-effect/Aggro.webp",
    },
    CustomEffect: {
        type: "CustomEffect",
        label: "Custom effect",
        addLabel: "Add custom effect",
        icon: "/Images/status-effect/Discard.webp",
        iconAlt: "custom_icon",
        create: () => createCustomEffect(),
        migrate: raw => createCustomEffect(raw),
        tabIcon: skill => skill.customImg || "/Images/status-effect/Discard.webp",
        image: {
            read: skill => skill.customImg,
            clear: skill => ({ ...skill, customImg: "" }),
        },
    },
    MentalEffect: {
        type: "MentalEffect",
        label: "Mental effect",
        addLabel: "Add mental effect",
        icon: "/Images/Sanity.webp",
        iconAlt: "mental_icon",
        create: () => createMentalEffect(),
        migrate: raw => createMentalEffect(raw),
        tabIcon: () => "/Images/Sanity.webp",
    },
} satisfies { [K in SkillType]: SkillData<K> }

export const getSkillData = (type: SkillType): SkillData<SkillType> => SKILL_DATA[type]

export const isKnownSkillType = (type: unknown): type is SkillType =>
    typeof type === "string" && (SKILL_TYPES as readonly string[]).includes(type)

export function migrateSkill(skill: SkillDetail): SkillDetail {
    return isKnownSkillType(skill.type) ? getSkillData(skill.type).migrate(skill) : skill
}

export const readSkillImage = (skill: SkillDetail): string | undefined =>
    getSkillData(skill.type).image?.read(skill)

export const clearSkillImage = (skill: SkillDetail): SkillDetail =>
    getSkillData(skill.type).image?.clear(skill) ?? skill
