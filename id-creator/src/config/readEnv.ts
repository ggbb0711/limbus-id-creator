interface NumberOptions {
    min?: number
    max?: number
    integer?: boolean
}

const warned = new Set<string>()

function warnOnce(name: string, raw: string | undefined, fallback: number) {
    if (process.env.NODE_ENV === "production" || warned.has(name)) return
    warned.add(name)
    console.warn(`[config] ${name}=${JSON.stringify(raw)} is missing or invalid, using default ${fallback}`)
}

export function readNumber(raw: string | undefined, name: string, fallback: number, { min = -Infinity, max = Infinity, integer = false }: NumberOptions = {}): number {
    if (raw === undefined || raw.trim() === "") {
        warnOnce(name, raw, fallback)
        return fallback
    }
    const value = Number(raw)
    if (!Number.isFinite(value) || value < min || value > max || (integer && !Number.isInteger(value))) {
        warnOnce(name, raw, fallback)
        return fallback
    }
    return value
}

export const readInt = (raw: string | undefined, name: string, fallback: number, options: Omit<NumberOptions, "integer"> = {}): number =>
    readNumber(raw, name, fallback, { ...options, integer: true })

export const readString = (raw: string | undefined, fallback: string): string =>
    raw === undefined ? fallback : raw.trim()

export const __resetEnvWarnings = () => warned.clear()
