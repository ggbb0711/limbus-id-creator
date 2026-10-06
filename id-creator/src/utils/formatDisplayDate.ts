const dateFormat = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeZone: "UTC" })
const dateTimeFormat = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" })

export default function formatDisplayDate(date: string | Date, { withTime = false }: { withTime?: boolean } = {}): string {
    const parsed = new Date(date)
    if (Number.isNaN(parsed.getTime())) return typeof date === "string" ? date : ""
    return (withTime ? dateTimeFormat : dateFormat).format(parsed)
}
