export const SOCIAL_CARD_SIZE = { width: 1200, height: 630 } as const
export const SOCIAL_CARD_CONTENT_TYPE = "image/png"
export const SOCIAL_CARD_COLORS = {
    background: "#1a1111",
    panel: "#4e0a06",
    border: "#453A32",
    text: "#D3B794",
    muted: "#9c8a73",
} as const

const SUPPORTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/gif"]
const DATA_URL = /^data:(image\/[a-z]+);base64,/i

export const isSupportedImageType = (contentType: string | null | undefined): boolean =>
    !!contentType && SUPPORTED_IMAGE_TYPES.includes(contentType.split(";")[0].trim().toLowerCase())

export function supportedDataUrl(value: string): string | null {
    const match = DATA_URL.exec(value)
    return match && isSupportedImageType(match[1]) ? value : null
}

export function truncateText(text: string, max: number): string {
    const clean = text.replace(/\s+/g, " ").trim()
    return clean.length <= max ? clean : `${clean.slice(0, Math.max(0, max - 1)).trimEnd()}…`
}
