import { StatusEffectInfo } from 'features/cardCreator/types/StatusEffectInfo'
import { escapeHtml } from './escapeHtml'
import { CUSTOM_COIN_EFFECT_COUNT, KeywordMap, coinEffectHtml, coinHtml, coinIconHtml, statusEffectHtml, triggerHtml } from './keywords'
import triggers from './baseStatusEffects/triggers.json'
import buff from './baseStatusEffects/statuses/buff.json'
import debuff from './baseStatusEffects/statuses/debuff.json'
import neutral from './baseStatusEffects/statuses/neutral.json'

type StatusEffectData = Readonly<Record<string, StatusEffectInfo>>

const COIN_VARIANTS = { unbreakable: "unbreakable_coin", excision: "excision_coin" } as const

const withEscapedDescription = (data: StatusEffectData): StatusEffectData =>
    Object.fromEntries(Object.entries(data).map(([key, info]) => [key, { ...info, description: escapeHtml(info.description) }]))

const statuses = withEscapedDescription({ ...buff, ...debuff, ...neutral })
const triggerInfos = withEscapedDescription(triggers)

export const baseStatusEffectInfos: StatusEffectData = { ...statuses, ...triggerInfos }

const coinNumbers = Array.from({ length: CUSTOM_COIN_EFFECT_COUNT }, (_, i) => i + 1)

const coinKeywords = coinNumbers.flatMap(coinNo => [
    [`coin_${coinNo}`, coinHtml(coinNo)],
    ...Object.entries(COIN_VARIANTS).map(([variant, statusKey]) => [
        `coin_${coinNo}_${variant}`,
        coinEffectHtml(coinIconHtml(coinNo, `coin-effect-${coinNo}-${variant}`), statusEffectHtml(statuses[statusKey])),
    ]),
])

export const baseStatusEffect: KeywordMap = {
    ...Object.fromEntries(Object.entries(statuses).map(([key, info]) => [key, statusEffectHtml(info)])),
    ...Object.fromEntries(coinKeywords),
    ...Object.fromEntries(Object.entries(triggerInfos).map(([key, info]) => [key, triggerHtml(info)])),
}

export function baseStatusEffectInfoOf(key: string): StatusEffectInfo | undefined {
    const variant = key.match(/^coin_\d+_(\w+)$/)?.[1] as keyof typeof COIN_VARIANTS | undefined
    return baseStatusEffectInfos[variant && COIN_VARIANTS[variant] ? COIN_VARIANTS[variant] : key]
}
