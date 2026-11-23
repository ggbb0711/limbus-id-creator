import { act, renderHook } from '@testing-library/react'
import { useCarouselIndex } from './useCarouselIndex'

describe('useCarouselIndex', () => {
    it('stays inside the bounds', () => {
        const { result } = renderHook(() => useCarouselIndex(3))
        expect(result.current).toMatchObject({ index: 0, hasPrev: false, hasNext: true })
        act(() => result.current.prev())
        expect(result.current.index).toBe(0)
        act(() => { result.current.next(); result.current.next(); result.current.next() })
        expect(result.current).toMatchObject({ index: 2, hasPrev: true, hasNext: false })
        act(() => result.current.set(10))
        expect(result.current.index).toBe(2)
    })

    it('handles an empty list', () => {
        const { result } = renderHook(() => useCarouselIndex(0))
        expect(result.current).toMatchObject({ index: 0, hasPrev: false, hasNext: false })
    })
})
