import React from 'react'
import { Provider } from 'react-redux'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { appConfig } from 'config/env.client'
import { makeStore } from 'stores/AppStore'
import ForumPage from './ForumPage'

const mockListeners = new Set<() => void>()
const mockHistory: { mode: 'push' | 'replace', url: string }[] = []

function mockNavigate(mode: 'push' | 'replace', url: string) {
    mockHistory.push({ mode, url })
    window.history.replaceState(null, '', url)
    mockListeners.forEach(listener => listener())
}

jest.mock('next/navigation', () => {
    const { useEffect, useReducer } = jest.requireActual<typeof import('react')>('react')
    return {
        usePathname: () => '/forum',
        useRouter: () => ({
            push: (url: string) => mockNavigate('push', url),
            replace: (url: string) => mockNavigate('replace', url),
        }),
        useSearchParams: () => {
            const [, rerender] = useReducer((n: number) => n + 1, 0)
            useEffect(() => {
                mockListeners.add(rerender)
                return () => { mockListeners.delete(rerender) }
            }, [])
            return new URLSearchParams(window.location.search)
        },
    }
})
jest.mock('hooks/useAuth', () => ({ useAuth: () => ({ user: null, isInitializing: false }) }))
const mockUsePaginatedPosts = jest.fn()
jest.mock('features/post/hooks/usePaginatedPosts', () => ({
    usePaginatedPosts: (...args: unknown[]) => mockUsePaginatedPosts(...args),
}))

function setup(search = '') {
    window.history.replaceState(null, '', `/forum${search}`)
    render(<Provider store={makeStore()}><ForumPage/></Provider>)
}

describe('ForumPage URL state', () => {
    beforeAll(() => { Element.prototype.scrollIntoView = jest.fn() })

    beforeEach(() => {
        jest.useFakeTimers()
        mockHistory.length = 0
        mockUsePaginatedPosts.mockReturnValue({ postList: [], maxCount: 0, pageSize: 10, isLoading: false, error: undefined, refetch: jest.fn() })
    })

    afterEach(() => jest.useRealTimers())

    it('keeps a sort change made while the search is debouncing', () => {
        setup()
        fireEvent.change(screen.getByLabelText('Post name:'), { target: { value: 'abc' } })
        fireEvent.click(screen.getByRole('combobox', { name: 'Sort posts by' }))
        fireEvent.click(screen.getByRole('option', { name: 'Title' }))
        act(() => { jest.advanceTimersByTime(appConfig.timing.searchDebounceMs) })
        const params = new URLSearchParams(window.location.search)
        expect(params.get('q')).toBe('abc')
        expect(params.get('sort')).toBe('Title')
    })

    it('pushes filter changes and replaces while typing', () => {
        setup()
        fireEvent.click(screen.getByRole('combobox', { name: 'Sort posts by' }))
        fireEvent.click(screen.getByRole('option', { name: 'Most Viewed' }))
        fireEvent.change(screen.getByLabelText('Post name:'), { target: { value: 'x' } })
        act(() => { jest.advanceTimersByTime(appConfig.timing.searchDebounceMs) })
        expect(mockHistory.map(entry => entry.mode)).toEqual(['push', 'replace'])
    })

    it('ignores prototype tag keys from the URL', () => {
        setup('?tag=constructor&tag=Faust&page=1.5')
        expect(mockUsePaginatedPosts).toHaveBeenLastCalledWith(0, expect.objectContaining({ tag: ['Faust'] }), undefined)
        expect(screen.getAllByRole('button', { name: /^Remove/ })).toHaveLength(1)
    })
})
