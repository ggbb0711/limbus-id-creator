export function safeParseJSON<T>(raw: string | null | undefined, fallback: T, convert: (value: unknown) => T = value => value as T): T {
    if (raw === null || raw === undefined || raw.trim() === "") return fallback
    try {
        return convert(JSON.parse(raw))
    } catch {
        return fallback
    }
}
