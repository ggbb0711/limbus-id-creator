export default function formatSigned(value: number): string {
    if (!Number.isFinite(value)) return "+0"
    return value < 0 ? `${value}` : `+${value}`
}
