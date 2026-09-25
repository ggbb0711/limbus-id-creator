export default function formatDateForBackend(date: Date): string {
    return date.toISOString()
}
