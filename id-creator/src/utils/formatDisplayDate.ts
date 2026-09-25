const displayDateFormat = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeZone: "UTC" })

export default function formatDisplayDate(date: string | Date): string {
    return displayDateFormat.format(new Date(date))
}
