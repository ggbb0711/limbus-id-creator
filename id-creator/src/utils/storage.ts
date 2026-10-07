import { z } from "zod"

export const lenientArray = <T>(item: z.ZodType<T>) =>
    z.array(z.unknown()).catch([]).transform(items =>
        items.flatMap(value => {
            const result = item.safeParse(value)
            return result.success ? [result.data] : []
        }))

export function parseJSON<T>(raw: string | null | undefined, schema: z.ZodType<T>, fallback: T): T {
    if (raw === null || raw === undefined || raw.trim() === "") return fallback
    try {
        const result = schema.safeParse(JSON.parse(raw))
        return result.success ? result.data : fallback
    } catch {
        return fallback
    }
}

export function readStorage(key: string): string | null {
    try {
        return localStorage.getItem(key)
    } catch {
        return null
    }
}

export function writeStorage(key: string, value: string): void {
    try {
        localStorage.setItem(key, value)
    } catch {
        return
    }
}

export const readJSON = <T>(key: string, schema: z.ZodType<T>, fallback: T): T => parseJSON(readStorage(key), schema, fallback)

export const writeJSON = (key: string, value: unknown): void => writeStorage(key, JSON.stringify(value))
