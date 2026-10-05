export type SaveTimeKey = "saveTime" | "updateTime"

const timeOf = (value: string | undefined) => {
    const time = Date.parse(value ?? "")
    return Number.isNaN(time) ? 0 : time
}

export function sortSavesByTimeDesc<T extends { saveTime: string; updateTime?: string }>(saves: readonly T[], key: SaveTimeKey = "saveTime"): T[] {
    return [...saves].sort((a, b) => timeOf(b[key]) - timeOf(a[key]))
}
