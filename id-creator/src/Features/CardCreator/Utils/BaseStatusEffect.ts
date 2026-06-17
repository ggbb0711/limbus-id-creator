import keyword from './BaseStatusEffects/keyword.json'
import buff from './BaseStatusEffects/Statuses/buff.json'
import debuff from './BaseStatusEffects/Statuses/debuff.json'
import neutral from './BaseStatusEffects/Statuses/neutral.json'

export const baseStatusEffect: Record<string, string> = {
    ...buff,
    ...debuff,
    ...neutral,
    ...keyword,
}