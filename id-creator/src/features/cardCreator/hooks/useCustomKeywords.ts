import { useMemo, useSyncExternalStore } from "react"
import { ICustomKeyword } from "features/cardCreator/types/ICustomKeyword"
import { parseCustomKeywords, readCustomKeywordsRaw, subscribeCustomKeywords } from "features/cardCreator/utils/keywords/customKeywordStorage"

const readOnServer = () => null

export function useCustomKeywords(): ICustomKeyword[] {
    const raw = useSyncExternalStore(subscribeCustomKeywords, readCustomKeywordsRaw, readOnServer)
    return useMemo(() => parseCustomKeywords(raw), [raw])
}
