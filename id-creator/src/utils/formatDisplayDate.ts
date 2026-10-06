const ISO_WITHOUT_OFFSET = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?$/
const HAS_OFFSET = /([zZ]|[+-]\d{2}:?\d{2})$/

const dateFormat = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeZone: "UTC" })
const utcDateTimeFormat = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" })
const localDateTimeFormat = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" })

export const DATE_FALLBACK = "—"

export function parseServerDate(value: string | Date | null | undefined): Date | null {
    if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value
    if (typeof value !== "string" || !value.trim()) return null
    const trimmed = value.trim()
    const parsed = new Date(ISO_WITHOUT_OFFSET.test(trimmed) ? `${trimmed}Z` : trimmed)
    return Number.isNaN(parsed.getTime()) ? null : parsed
}

interface FormatOptions {
    withTime?: boolean
    fallback?: string
}

export default function formatDisplayDate(value: string | Date | null | undefined, { withTime = false, fallback = DATE_FALLBACK }: FormatOptions = {}): string {
    const parsed = parseServerDate(value)
    if (!parsed) return fallback
    if (!withTime) return dateFormat.format(parsed)
    const hasOffset = value instanceof Date || HAS_OFFSET.test(String(value).trim())
    return (hasOffset ? localDateTimeFormat : utcDateTimeFormat).format(parsed)
}
