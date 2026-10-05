import { ICustomKeyword } from "features/cardCreator/types/ICustomKeyword"
import { SkillDetail, isSkillType } from "features/cardCreator/types/SkillDetail"
import { ICustomEffect } from "features/cardCreator/types/skills/customEffect/ICustomEffect"
import { escapeHtml, isSafeCssColor, isSafeImageUrl } from "features/cardCreator/utils/keywords/escapeHtml"

export type KeywordMap = Readonly<Record<string, string>>

export interface KeywordSuggestion {
    keyword: string
    html: string
}

export const CUSTOM_COIN_EFFECT_COUNT = 9

const STATUS_NODE_PATTERN = /<span\s+data-status-effect[^>]*>[\s\S]*?<\/span>\s*<\/span>|<[^>]*>|(\[([^ ]+)\])/g

const escapeAttribute = (value: string) => value.replace(/&/g, "&amp;").replace(/"/g, "&quot;")

export const toKeywordKey = (name: string) => name.replace(/\s/g, "_").toLowerCase()

export function replaceKeywordsAsNodes(html: string, keywords: KeywordMap): string {
    return html.replace(STATUS_NODE_PATTERN, (match, bracket, key) => {
        if (!bracket) return match
        const selected = keywords[key.toLowerCase().replace(/&amp;/g, "&")]
        return selected ? `<span data-status-effect="${escapeAttribute(selected)}">${selected}</span>` : match
    })
}

export function filterKeywordSuggestions(keywords: KeywordMap, query: string, limit = 10): KeywordSuggestion[] {
    const lowerQuery = query.toLowerCase()
    return Object.keys(keywords)
        .filter(key => key.toLowerCase().startsWith(lowerQuery))
        .slice(0, limit)
        .map(key => ({ keyword: key, html: keywords[key] }))
}

const colorStyle = (color: string) => (color && isSafeCssColor(color) ? `color:${color.trim()};` : "")

const customImage = (src: string) =>
    src && isSafeImageUrl(src) ? `<img class='status-icon' src='${escapeHtml(src)}' alt='custom_icon' />` : ""

export function customEffectHtml(effect: ICustomEffect): string {
    return `<span class='center-element' contenteditable='false' style='${colorStyle(effect.effectColor)}text-decoration:underline;'>${customImage(effect.customImg)}${escapeHtml(effect.name)}</span>`
}

export function customCoinEffectHtml(effect: ICustomEffect, statusKey: string, coinNo: number): string {
    return `<span class='center-element' contenteditable='false'><img class='status-icon' src='/Images/status-effect/Coin_Effect_${coinNo}.webp' alt='coin-effect-${coinNo}' /> <span class='center-element' contenteditable='false' data-custom-coin-effect='coin-effect-${coinNo}-custom-${escapeHtml(statusKey)}' style='${colorStyle(effect.effectColor)}text-decoration:underline;'>${customImage(effect.customImg)}${escapeHtml(effect.name)}</span></span>`
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
        `<span class='center-element' contenteditable='false' style='${colorStyle(keyword.color)}'>${escapeHtml(keyword.keyword)}</span>`,
    ]))
}
