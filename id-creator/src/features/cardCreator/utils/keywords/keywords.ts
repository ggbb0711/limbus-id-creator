import { ICustomKeyword } from "features/cardCreator/types/ICustomKeyword"
import type { StatusEffectInfo } from "features/cardCreator/types/StatusEffectInfo"
import { SkillDetail, isSkillType } from "features/cardCreator/types/SkillDetail"
import { ICustomEffect } from "features/cardCreator/types/skills/customEffect/ICustomEffect"
import { escapeHtml, isSafeCssColor, isSafeImageUrl } from "features/cardCreator/utils/keywords/escapeHtml"
import { sanitizeCardHtml } from "utils/htmlUtils"

export type KeywordMap = Readonly<Record<string, string>>

export interface KeywordSuggestion {
    keyword: string
    html: string
}

export const CUSTOM_COIN_EFFECT_COUNT = 9

const STATUS_NODE_PATTERN = /<span\s+data-status-effect[^>]*>[\s\S]*?<\/span>\s*<\/span>|<[^>]*>|(\[([^ ]+)\])/g

export const toKeywordKey = (name: string) => name.replace(/\s/g, "_").toLowerCase()

export function replaceKeywordsAsNodes(html: string, keywords: KeywordMap): string {
    return html.replace(STATUS_NODE_PATTERN, (match, bracket, key) => {
        if (!bracket) return match
        const name = key.replace(/&amp;/g, "&")
        const selected = keywords[name.toLowerCase()] ?? keywords[name]
        return selected ? `<span data-status-effect="${escapeHtml(selected)}">${selected}</span>` : match
    })
}

export function filterKeywordSuggestions(keywords: KeywordMap, query: string, limit = 10): KeywordSuggestion[] {
    const lowerQuery = query.toLowerCase()
    return Object.keys(keywords)
        .filter(key => key.toLowerCase().startsWith(lowerQuery))
        .slice(0, limit)
        .map(key => ({ keyword: key, html: keywords[key] }))
}

const colorDeclaration = (color: string) => (color && isSafeCssColor(color) ? `color:${color.trim()}` : "")

const colorStyle = (color: string) => (colorDeclaration(color) ? `${colorDeclaration(color)};` : "")

const customImage = (src: string) =>
    src && isSafeImageUrl(src) ? `<img class='status-icon' src='${escapeHtml(src)}' alt='' />` : ""

type StatusEffectLook = Pick<StatusEffectInfo, "name" | "image" | "color">

const coinEffectAttribute = (coinEffectId?: string) =>
    coinEffectId ? ` data-custom-coin-effect='${escapeHtml(coinEffectId)}'` : ""

export function statusEffectHtml(info: StatusEffectLook, coinEffectId?: string): string {
    return sanitizeCardHtml(`<span class='center-element' contenteditable='false'${coinEffectAttribute(coinEffectId)} style='${colorStyle(info.color)}text-decoration:underline;'>${customImage(info.image)}${escapeHtml(info.name)}</span>`)
}

const labelHtml = (name: string, style: string): string =>
    sanitizeCardHtml(`<span class='center-element' contenteditable='false' style='${style}'>${escapeHtml(name)}</span>`)

export function triggerHtml(info: Pick<StatusEffectInfo, "name" | "color">): string {
    return labelHtml(info.name, colorDeclaration(info.color))
}

export function coinIconHtml(coinNo: number, coinEffectId?: string): string {
    return `<img class='status-icon' src='/Images/status-effect/Coin_Effect_${coinNo}.webp' alt='Coin ${coinNo}'${coinEffectAttribute(coinEffectId)} />`
}

export function coinHtml(coinNo: number): string {
    return sanitizeCardHtml(`<span class='center-element' contenteditable='false'>${coinIconHtml(coinNo)}</span>`)
}

export function coinEffectHtml(coinIcon: string, statusEffect: string): string {
    return sanitizeCardHtml(`<span class='center-element' contenteditable='false'>${coinIcon} ${statusEffect}</span>`)
}

const customEffectLook = (effect: ICustomEffect): StatusEffectLook =>
    ({ name: effect.name, image: effect.customImg, color: effect.effectColor })

export function customEffectHtml(effect: ICustomEffect): string {
    return statusEffectHtml(customEffectLook(effect))
}

export function customCoinEffectHtml(effect: ICustomEffect, statusKey: string, coinNo: number): string {
    return coinEffectHtml(coinIconHtml(coinNo), statusEffectHtml(customEffectLook(effect), `coin-effect-${coinNo}-custom-${statusKey}`))
}

export function buildCustomEffectKeywords(skills: readonly SkillDetail[]): Record<string, string> {
    const keywords: Record<string, string> = {}
    skills.filter(isSkillType("CustomEffect")).forEach(effect => {
        if (!effect.name) return
        const statusKey = toKeywordKey(effect.name)
        keywords[statusKey] = customEffectHtml(effect)
        if (!effect.isCoinType) return
        for (let coinNo = 1; coinNo <= CUSTOM_COIN_EFFECT_COUNT; coinNo++) {
            keywords[`coin_${coinNo}_${statusKey}`] = customCoinEffectHtml(effect, statusKey, coinNo)
        }
    })
    return keywords
}

export function buildLocalKeywords(keywords: readonly ICustomKeyword[]): Record<string, string> {
    return Object.fromEntries(keywords.map(keyword => [
        toKeywordKey(keyword.keyword),
        labelHtml(keyword.keyword, colorStyle(keyword.color)),
    ]))
}
