import { useMemo } from 'react'
import { baseStatusEffect } from 'features/cardCreator/utils/keywords/BaseStatusEffect'
import { buildCustomEffectKeywords, buildLocalKeywords } from 'features/cardCreator/utils/keywords/keywords'
import { useCardMode } from 'features/cardCreator/contexts/CardModeContext'
import { useAppSelector } from 'stores/AppStore'
import { CUSTOM_KEYWORDS_STORAGE_KEY, parseCustomKeywords } from 'features/cardCreator/utils/keywords/customKeywordStorage'

export function useStatusEffect(): { [key: string]: string } {
    const mode = useCardMode()
    const skillDetails = useAppSelector(state =>
        mode === "id" ? state.idInfo.value.skillDetails : state.egoInfo.value.skillDetails
    )

    const skillCustomEffects = useMemo(() => buildCustomEffectKeywords(skillDetails), [JSON.stringify(skillDetails)])

    const storedCustomKeywords = localStorage.getItem(CUSTOM_KEYWORDS_STORAGE_KEY)
    const localCustomKeywords = useMemo(() => buildLocalKeywords(parseCustomKeywords(storedCustomKeywords)), [storedCustomKeywords])

    const statusEffect = useMemo(() => {
        return { ...baseStatusEffect, ...skillCustomEffects, ...localCustomKeywords }
    }, [skillCustomEffects, localCustomKeywords])

    return statusEffect
}

