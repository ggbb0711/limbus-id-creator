import type { BaseQueryApi, FetchArgs } from '@reduxjs/toolkit/query/react'
import { makeStore } from 'stores/AppStore'
import { setCredentials } from 'stores/slices/AuthSlice'

type Call = string | FetchArgs
type RawResult = { data?: unknown, error?: { status: number | string, data?: unknown } }

const mockRawQuery = jest.fn<Promise<RawResult>, [Call, BaseQueryApi, object]>()

jest.mock('@reduxjs/toolkit/query/react', () => {
    const actual = jest.requireActual('@reduxjs/toolkit/query/react')
    return { ...actual, fetchBaseQuery: () => (args: Call, api: BaseQueryApi, extra: object) => mockRawQuery(args, api, extra) }
})

const { baseQueryWithReauth, rejectUnsuccessful } = jest.requireActual<typeof import('./BaseApi')>('./BaseApi')

const urlOf = (args: Call) => (typeof args === 'string' ? args : args.url)
const refreshBody = (token: string) => ({ data: { success: true, data: { accessToken: token, userSessionProfile: { id: 'me', userEmail: '', userName: 'n', userIcon: '' } } } })

function apiFor(store: ReturnType<typeof makeStore>): BaseQueryApi {
    return { dispatch: store.dispatch, getState: store.getState, signal: new AbortController().signal, abort: jest.fn(), extra: undefined, endpoint: 'test', type: 'query' }
}

describe('rejectUnsuccessful', () => {
    it('turns a success:false body into a CUSTOM_ERROR with the server message', () => {
        const result = rejectUnsuccessful({ data: { success: false, message: 'Name taken', data: null, errorCode: null } })
        expect(result.error).toEqual({ status: 'CUSTOM_ERROR', error: 'Name taken', data: { success: false, message: 'Name taken', data: null, errorCode: null } })
        expect(result.data).toBeUndefined()
    })

    it('leaves successful results and existing errors alone', () => {
        const ok = { data: { success: true, data: 1, message: '', errorCode: null } }
        expect(rejectUnsuccessful(ok)).toBe(ok)
        const failed = { error: { status: 500, data: {} } }
        expect(rejectUnsuccessful(failed as never)).toBe(failed)
    })
})

describe('baseQueryWithReauth', () => {
    beforeEach(() => mockRawQuery.mockReset())

    it('returns CUSTOM_ERROR when the backend answers 200 with success:false', async () => {
        mockRawQuery.mockResolvedValue({ data: { success: false, message: 'Nope', data: null } })
        const result = await baseQueryWithReauth('/Post', apiFor(makeStore()), {})
        expect(result.error).toMatchObject({ status: 'CUSTOM_ERROR', error: 'Nope' })
    })

    it('shares one refresh between concurrent 401s and retries both requests', async () => {
        const store = makeStore()
        let refreshed = false
        let refreshCalls = 0
        mockRawQuery.mockImplementation(async (args) => {
            if (urlOf(args) === '/Auth/refresh') {
                refreshCalls++
                await new Promise(resolve => setTimeout(resolve, 5))
                refreshed = true
                return refreshBody('new-token')
            }
            return refreshed ? { data: { success: true, data: urlOf(args) } } : { error: { status: 401 } }
        })
        const [a, b] = await Promise.all([
            baseQueryWithReauth('/A', apiFor(store), {}),
            baseQueryWithReauth('/B', apiFor(store), {}),
        ])
        expect(refreshCalls).toBe(1)
        expect(a.data).toMatchObject({ data: '/A' })
        expect(b.data).toMatchObject({ data: '/B' })
        expect(store.getState().auth.accessToken).toBe('new-token')
    })

    it('clears credentials when the refresh fails', async () => {
        const store = makeStore()
        store.dispatch(setCredentials({ accessToken: 'old', user: { id: 'me', userEmail: '', userName: 'n', userIcon: '' } }))
        mockRawQuery.mockResolvedValue({ error: { status: 401 } })
        const result = await baseQueryWithReauth('/A', apiFor(store), {})
        expect(result.error).toMatchObject({ status: 401 })
        expect(store.getState().auth).toMatchObject({ accessToken: null, user: null, isInitializing: false })
    })

    it('does not refresh in response to the refresh endpoint itself', async () => {
        mockRawQuery.mockResolvedValue({ error: { status: 401 } })
        await baseQueryWithReauth({ url: '/Auth/refresh', method: 'POST' }, apiFor(makeStore()), {})
        expect(mockRawQuery).toHaveBeenCalledTimes(1)
    })
})
