import { renderHook } from '@testing-library/react'
import { appConfig } from 'config/env.client'
import { useGetPostsQuery } from 'features/post/api/PostApi'
import { usePaginatedPosts } from './usePaginatedPosts'

const addAlert = jest.fn()
jest.mock('hooks/useAlert', () => ({ __esModule: true, default: () => ({ alertArr: [], addAlert }) }))
jest.mock('features/post/api/PostApi', () => ({ useGetPostsQuery: jest.fn() }))

const query = jest.mocked(useGetPostsQuery)

describe('usePaginatedPosts', () => {
    beforeEach(() => {
        addAlert.mockClear()
        query.mockReset()
    })

    it('requests the page with the configured size and filter', () => {
        query.mockReturnValue({ data: { list: [{ id: 'a' }], total: 7 }, isLoading: false, isFetching: true } as never)
        const { result } = renderHook(() => usePaginatedPosts(2, { userId: 'u1' }))
        expect(query).toHaveBeenCalledWith({ userId: 'u1', page: 2, limit: appConfig.paging.postsPerPage })
        expect(result.current).toMatchObject({ postList: [{ id: 'a' }], maxCount: 7, pageSize: appConfig.paging.postsPerPage, isFetching: true })
    })

    it('returns empty defaults while there is no data', () => {
        query.mockReturnValue({ isLoading: true, isFetching: true } as never)
        const { result } = renderHook(() => usePaginatedPosts(0))
        expect(result.current.postList).toEqual([])
        expect(result.current.maxCount).toBe(0)
    })

    it('alerts once per error', () => {
        query.mockReturnValue({ error: { status: 500, data: { msg: 'Server down' } }, isLoading: false, isFetching: false } as never)
        const { rerender } = renderHook(() => usePaginatedPosts(0))
        rerender()
        expect(addAlert).toHaveBeenCalledTimes(1)
        expect(addAlert).toHaveBeenCalledWith('Failure', expect.any(String))
    })
})
