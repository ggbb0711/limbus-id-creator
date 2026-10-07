import { z } from "zod"
import { ICustomKeyword } from "features/cardCreator/types/ICustomKeyword"
import { lenientArray, parseJSON, readJSON, readStorage, writeJSON } from "utils/storage"

export const CUSTOM_KEYWORDS_STORAGE_KEY = "customKeywords"

const customKeywordSchema = z.object({ customKeywordID: z.string(), keyword: z.string(), color: z.string() })

const customKeywordListSchema = lenientArray(customKeywordSchema)

export const parseCustomKeywords = (raw: string | null): ICustomKeyword[] =>
    parseJSON(raw, customKeywordListSchema, [])

export const loadCustomKeywords = (): ICustomKeyword[] => readJSON(CUSTOM_KEYWORDS_STORAGE_KEY, customKeywordListSchema, [])

const listeners = new Set<() => void>()

export function saveCustomKeywords(keywords: readonly ICustomKeyword[]): void {
    writeJSON(CUSTOM_KEYWORDS_STORAGE_KEY, keywords)
    listeners.forEach(listener => listener())
}

export const readCustomKeywordsRaw = (): string | null => readStorage(CUSTOM_KEYWORDS_STORAGE_KEY)

export function subscribeCustomKeywords(listener: () => void): () => void {
    const onStorage = (event: StorageEvent) => {
        if (event.key === null || event.key === CUSTOM_KEYWORDS_STORAGE_KEY) listener()
    }
    listeners.add(listener)
    window.addEventListener("storage", onStorage)
    return () => {
        listeners.delete(listener)
        window.removeEventListener("storage", onStorage)
    }
}
