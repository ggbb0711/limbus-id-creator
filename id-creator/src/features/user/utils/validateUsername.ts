export function validateUsername(name: string, max: number): string | null {
    const length = name.trim().length
    if (length < 1 || length > max) return `Username must have at least one character and at most ${max} characters`
    return null
}
