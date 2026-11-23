import { SkillDetail, isSkillType } from "features/cardCreator/types/SkillDetail"
import { ICustomEffect } from "features/cardCreator/types/skills/customEffect/ICustomEffect"
import { toKeywordKey } from "features/cardCreator/utils/keywords/keywords"
import { stripHtml } from "utils/htmlUtils"

export interface StatusEffectInfo {
    key: string
    name: string
    image: string
    color: string
    description: string
}

export type StatusEffectLookup = Readonly<Record<string, StatusEffectInfo>>

export const fromCustomEffect = (effect: ICustomEffect): StatusEffectInfo => ({
    key: toKeywordKey(effect.name),
    name: effect.name,
    image: effect.customImg,
    color: effect.effectColor,
    description: effect.effect,
})

export const hasDescription = (info: StatusEffectInfo): boolean => stripHtml(info.description).trim().length > 0

export function buildStatusEffectLookup(skills: readonly SkillDetail[]): StatusEffectLookup {
    const lookup: Record<string, StatusEffectInfo> = {}
    skills.filter(isSkillType("CustomEffect")).forEach(effect => {
        if (!effect.name.trim()) return
        const info = fromCustomEffect(effect)
        if (hasDescription(info)) lookup[info.key] = info
    })
    return lookup
}
