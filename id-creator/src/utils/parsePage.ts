export function parsePage(value: string | null | undefined): number {
    if (!value || !/^\d+$/.test(value)) return 0
    const page = Number(value)
    return Number.isSafeInteger(page) ? page : 0
}

export function withPage(search: string, page: number): string {
    const params = new URLSearchParams(search)
    if (page > 0) params.set("page", String(page))
    else params.delete("page")
    return params.toString()
}
