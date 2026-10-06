import { renderHook } from '@testing-library/react'
import { appConfig } from 'config/env.client'
import { useGetPostsQuery } from 'features/post/api/PostApi'
import { buildPostsQuery } from 'features/post/api/buildPostsQuery'
import { usePaginatedPosts } from './usePaginatedPosts'

const addAlert = jest.fn()
const refetch = jest.fn()
jest.mock('hooks/useAddAlert', () => ({ useAddAlert: () => addAlert }))
jest.mock('features/post/api/PostApi', () => ({ useGetPostsQuery: jest.fn() }))

const query = jest.mocked(useGetPostsQuery)
const limit = appConfig.paging.postsPerPage
const mockQuery = (result: object) => query.mockReturnValue({ refetch, isFetching: false, ...result } as never)

describe('usePaginatedPosts', () => {
    beforeEach(() => {
        addAlert.mockClear()
        query.mockReset()
    })

    it('requests the page with the configured size and filter', () => {
        mockQuery({ currentData: { list: [{ id: 'a' }], total: 7 } })
        const { result } = renderHook(() => usePaginatedPosts(2, { userId: 'u1' }))
        expect(query).toHaveBeenCalledWith({ userId: 'u1', page: 2, limit })
        expect(result.current).toMatchObject({ postList: [{ id: 'a' }], maxCount: 7, pageSize: limit, isLoading: false })
    })

    it('is loading while the current query has no data', () => {
        mockQuery({ isFetching: true })
        const { result } = renderHook(() => usePaginatedPosts(0))
        expect(result.current).toMatchObject({ postList: [], maxCount: 0, isLoading: true })
    })

    it('uses matching server data until the client query resolves', () => {
        mockQuery({ isFetching: true })
        const initial = { query: buildPostsQuery({ title: 'x', page: 0, limit }), data: { list: [{ id: 's' }], total: 1 } }
        const { result } = renderHook(() => usePaginatedPosts(0, { title: 'x' }, initial as never))
        expect(result.current).toMatchObject({ postList: [{ id: 's' }], isLoading: false })
    })

    it('ignores server data for a different query', () => {
        mockQuery({ isFetching: true })
        const initial = { query: buildPostsQuery({ title: 'other', page: 0, limit }), data: { list: [{ id: 's' }], total: 1 } }
        const { result } = renderHook(() => usePaginatedPosts(0, { title: 'x' }, initial as never))
        expect(result.current.postList).toEqual([])
    })

    it('exposes the error and refetch, and alerts once', () => {
        const error = { status: 'FETCH_ERROR' }
        mockQuery({ error })
        const { result, rerender } = renderHook(() => usePaginatedPosts(0))
        rerender()
        expect(result.current.error).toBe(error)
        expect(result.current.refetch).toBe(refetch)
        expect(addAlert).toHaveBeenCalledTimes(1)
    })
})
