import { makeStore } from 'stores/AppStore'
import { setCredentials } from 'stores/slices/AuthSlice'
import { BaseApi } from './BaseApi'
import { endSession } from './AuthApi'

const TestApi = BaseApi.injectEndpoints({
    endpoints: (builder) => ({
        cachedValue: builder.query<number, void>({ queryFn: () => ({ data: 1 }) }),
    }),
})

describe('endSession', () => {
    it('clears credentials and every cached query', async () => {
        const store = makeStore()
        store.dispatch(setCredentials({ accessToken: 't', user: { id: 'me', userEmail: '', userName: 'n', userIcon: '' } }))
        await store.dispatch(TestApi.endpoints.cachedValue.initiate())
        expect(Object.keys(store.getState().api.queries)).not.toHaveLength(0)
        endSession(store.dispatch)
        expect(store.getState().auth).toMatchObject({ accessToken: null, user: null, isInitializing: false })
        expect(store.getState().api.queries).toEqual({})
    })
})
