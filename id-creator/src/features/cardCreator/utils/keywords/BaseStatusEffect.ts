import keyword from './baseStatusEffects/keyword.json'
import buff from './baseStatusEffects/statuses/buff.json'
import debuff from './baseStatusEffects/statuses/debuff.json'
import neutral from './baseStatusEffects/statuses/neutral.json'

export const baseStatusEffect: Record<string, string> = {
    ...buff,
    ...debuff,
    ...neutral,
    ...keyword,
}