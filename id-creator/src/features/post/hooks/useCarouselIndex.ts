import { useCallback, useState } from "react"

export const clampIndex = (index: number, length: number) => Math.min(Math.max(0, index), Math.max(0, length - 1))

export function useCarouselIndex(length: number, initial = 0) {
    const [rawIndex, setRawIndex] = useState(initial)
    const index = clampIndex(rawIndex, length)

    const set = useCallback((next: number) => setRawIndex(clampIndex(next, length)), [length])
    const prev = useCallback(() => setRawIndex(current => clampIndex(clampIndex(current, length) - 1, length)), [length])
    const next = useCallback(() => setRawIndex(current => clampIndex(clampIndex(current, length) + 1, length)), [length])

    return { index, set, prev, next, hasPrev: index > 0, hasNext: index < length - 1 }
}

export type CarouselIndex = ReturnType<typeof useCarouselIndex>
