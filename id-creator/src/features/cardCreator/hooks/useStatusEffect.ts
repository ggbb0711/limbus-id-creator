import { useMemo } from 'react'
import { baseStatusEffect } from 'features/cardCreator/utils/keywords/BaseStatusEffect'
import { buildCustomEffectKeywords, buildLocalKeywords } from 'features/cardCreator/utils/keywords/keywords'
import { useCardSelector } from './useCardInfo'
import { useCustomKeywords } from './useCustomKeywords'

export function useStatusEffect(): { [key: string]: string } {
    const skillDetails = useCardSelector(info => info.skillDetails)
    const customKeywords = useCustomKeywords()

    const skillCustomEffects = useMemo(() => buildCustomEffectKeywords(skillDetails), [skillDetails])
    const localCustomKeywords = useMemo(() => buildLocalKeywords(customKeywords), [customKeywords])

    return useMemo(() => ({ ...baseStatusEffect, ...skillCustomEffects, ...localCustomKeywords }), [skillCustomEffects, localCustomKeywords])
}
