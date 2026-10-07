export function canAddTag<T>(list: readonly T[], item: T | null | undefined, max: number, isSame: (a: T, b: T) => boolean = Object.is): item is T {
    if (item === null || item === undefined) return false
    if (typeof item === "string" && item.trim() === "") return false
    return list.length < max && !list.some(existing => isSame(existing, item))
}
