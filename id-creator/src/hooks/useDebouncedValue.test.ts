import { act, renderHook } from '@testing-library/react'
import { useDebouncedValue } from './useDebouncedValue'

describe('useDebouncedValue', () => {
    beforeEach(() => jest.useFakeTimers())
    afterEach(() => jest.useRealTimers())

    it('starts with the initial value', () => {
        const { result } = renderHook(() => useDebouncedValue('a', 300))
        expect(result.current).toBe('a')
    })

    it('updates only after the delay', () => {
        const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 300), { initialProps: { value: 'a' } })
        rerender({ value: 'b' })
        act(() => { jest.advanceTimersByTime(299) })
        expect(result.current).toBe('a')
        act(() => { jest.advanceTimersByTime(1) })
        expect(result.current).toBe('b')
    })

    it('restarts the delay on every change and keeps only the last value', () => {
        const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 300), { initialProps: { value: 'a' } })
        rerender({ value: 'b' })
        act(() => { jest.advanceTimersByTime(200) })
        rerender({ value: 'c' })
        act(() => { jest.advanceTimersByTime(200) })
        expect(result.current).toBe('a')
        act(() => { jest.advanceTimersByTime(100) })
        expect(result.current).toBe('c')
    })

    it('updates on the next tick with a zero delay', () => {
        const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 0), { initialProps: { value: 1 } })
        rerender({ value: 2 })
        act(() => { jest.advanceTimersByTime(0) })
        expect(result.current).toBe(2)
    })

    it('does not update after unmount', () => {
        const { rerender, unmount } = renderHook(({ value }) => useDebouncedValue(value, 300), { initialProps: { value: 'a' } })
        rerender({ value: 'b' })
        unmount()
        expect(() => act(() => { jest.advanceTimersByTime(300) })).not.toThrow()
    })
})
