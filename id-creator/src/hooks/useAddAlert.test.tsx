import React from 'react'
import { Provider } from 'react-redux'
import { act, renderHook } from '@testing-library/react'
import { appConfig } from 'config/env.client'
import { makeStore } from 'stores/AppStore'
import { useAddAlert } from './useAddAlert'

function setup() {
    const store = makeStore()
    const wrapper = ({ children }: { children: React.ReactNode }) => <Provider store={store}>{children}</Provider>
    const hook = renderHook(() => useAddAlert(), { wrapper })
    return { store, ...hook }
}

describe('useAddAlert', () => {
    afterEach(() => jest.useRealTimers())

    it('returns the same function on every render', () => {
        const { result, rerender } = setup()
        const first = result.current
        rerender()
        expect(result.current).toBe(first)
    })

    it('adds an alert and removes it after alertMs', () => {
        jest.useFakeTimers()
        const { result, store } = setup()
        act(() => result.current('Failure', 'Oops'))
        expect(store.getState().alert.value).toEqual([expect.objectContaining({ status: 'Failure', msg: 'Oops', alertId: expect.any(String) })])
        act(() => jest.advanceTimersByTime(appConfig.timing.alertMs - 1))
        expect(store.getState().alert.value).toHaveLength(1)
        act(() => jest.advanceTimersByTime(1))
        expect(store.getState().alert.value).toEqual([])
    })

    it('gives each alert a unique id', () => {
        const { result, store } = setup()
        act(() => {
            result.current('Success', 'a')
            result.current('Success', 'b')
        })
        const [a, b] = store.getState().alert.value
        expect(a.alertId).not.toBe(b.alertId)
    })
})
