import React from 'react'
import { Provider } from 'react-redux'
import { renderHook } from '@testing-library/react'
import { makeStore } from 'stores/AppStore'
import { useApiErrorAlert } from './useApiErrorAlert'

function setup(initial: unknown) {
    const store = makeStore()
    const wrapper = ({ children }: { children: React.ReactNode }) => <Provider store={store}>{children}</Provider>
    const hook = renderHook(({ error }) => useApiErrorAlert(error, 'Fallback text'), { wrapper, initialProps: { error: initial } })
    return { store, ...hook }
}

describe('useApiErrorAlert', () => {
    it('does nothing without an error', () => {
        const { store } = setup(undefined)
        expect(store.getState().alert.value).toEqual([])
    })

    it('shows the server message once per error', () => {
        const error = { status: 400, data: { message: 'Bad search' } }
        const { store, rerender } = setup(error)
        rerender({ error })
        expect(store.getState().alert.value.map(a => a.msg)).toEqual(['Bad search'])
    })

    it('uses the fallback text when the error has no message', () => {
        const { store } = setup({ status: 500 })
        expect(store.getState().alert.value[0].msg).toBe('Fallback text')
    })
})
