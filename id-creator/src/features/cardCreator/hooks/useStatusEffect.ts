import { useMemo } from 'react'
import { baseStatusEffect } from 'features/cardCreator/utils/keywords/BaseStatusEffect'
import { buildCustomEffectKeywords, buildLocalKeywords } from 'features/cardCreator/utils/keywords/keywords'
import { useCardSelector } from './useCardInfo'
import { CUSTOM_KEYWORDS_STORAGE_KEY, parseCustomKeywords } from 'features/cardCreator/utils/keywords/customKeywordStorage'

export function useStatusEffect(): { [key: string]: string } {
    const skillDetails = useCardSelector(info => info.skillDetails)

    const skillCustomEffects = useMemo(() => buildCustomEffectKeywords(skillDetails), [JSON.stringify(skillDetails)])

    const storedCustomKeywords = localStorage.getItem(CUSTOM_KEYWORDS_STORAGE_KEY)
    const localCustomKeywords = useMemo(() => buildLocalKeywords(parseCustomKeywords(storedCustomKeywords)), [storedCustomKeywords])

    const statusEffect = useMemo(() => {
        return { ...baseStatusEffect, ...skillCustomEffects, ...localCustomKeywords }
    }, [skillCustomEffects, localCustomKeywords])

    return statusEffect
}

