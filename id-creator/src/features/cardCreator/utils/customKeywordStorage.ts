import { ICustomKeyword } from "features/cardCreator/types/ICustomKeyword"

export const CUSTOM_KEYWORDS_STORAGE_KEY = "customKeywords"

const isCustomKeyword = (value: unknown): value is ICustomKeyword => {
    if (typeof value !== "object" || value === null) return false
    const keyword = value as Record<string, unknown>
    return typeof keyword.customKeywordID === "string" && typeof keyword.keyword === "string" && typeof keyword.color === "string"
}

export function parseCustomKeywords(raw: string | null): ICustomKeyword[] {
    if (!raw) return []
    try {
        const parsed: unknown = JSON.parse(raw)
        return Array.isArray(parsed) ? parsed.filter(isCustomKeyword) : []
    } catch {
        return []
    }
}

export function loadCustomKeywords(): ICustomKeyword[] {
    try {
        return parseCustomKeywords(localStorage.getItem(CUSTOM_KEYWORDS_STORAGE_KEY))
    } catch {
        return []
    }
}

export function saveCustomKeywords(keywords: readonly ICustomKeyword[]): void {
    try {
        localStorage.setItem(CUSTOM_KEYWORDS_STORAGE_KEY, JSON.stringify(keywords))
    } catch {
        return
    }
}
