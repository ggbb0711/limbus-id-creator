export interface ReorderResult<T> {
    list: T[]
    newIndex: number
}

export function reorderSkills<T extends { inputId: string }>(list: readonly T[], fromId: string, toId: string): ReorderResult<T> | null {
    if (fromId === toId) return null
    const from = list.findIndex(item => item.inputId === fromId)
    if (from < 0 || !list.some(item => item.inputId === toId)) return null
    const next = list.slice()
    const [moved] = next.splice(from, 1)
    const target = next.findIndex(item => item.inputId === toId)
    const newIndex = from <= target ? target + 1 : target
    next.splice(newIndex, 0, moved)
    return { list: next, newIndex }
}
