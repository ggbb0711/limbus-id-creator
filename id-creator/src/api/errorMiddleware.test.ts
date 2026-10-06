import { configureStore } from '@reduxjs/toolkit'
import { BaseApi } from './BaseApi'
import { rtkQueryErrorReporter, shouldReportApiError } from './errorMiddleware'
import { reportError } from 'utils/reportError'

jest.mock('utils/reportError', () => ({ reportError: jest.fn() }))

const TestApi = BaseApi.injectEndpoints({
    endpoints: (builder) => ({
        failing: builder.query<number, number>({ queryFn: (status) => ({ error: { status, data: {} } }) }),
        working: builder.query<number, void>({ queryFn: () => ({ data: 1 }) }),
    }),
})

const makeTestStore = () => configureStore({
    reducer: { [BaseApi.reducerPath]: BaseApi.reducer },
    middleware: (getDefault) => getDefault().concat(BaseApi.middleware, rtkQueryErrorReporter),
})

describe('rtkQueryErrorReporter', () => {
    beforeEach(() => jest.mocked(reportError).mockClear())

    it('reports a failed request with the endpoint name', async () => {
        await makeTestStore().dispatch(TestApi.endpoints.failing.initiate(500))
        expect(reportError).toHaveBeenCalledWith({ status: 500, data: {} }, { context: 'api:failing' })
    })

    it('does not report 401 or 404', async () => {
        const store = makeTestStore()
        await store.dispatch(TestApi.endpoints.failing.initiate(401))
        await store.dispatch(TestApi.endpoints.failing.initiate(404))
        expect(reportError).not.toHaveBeenCalled()
    })

    it('ignores successful requests', async () => {
        await makeTestStore().dispatch(TestApi.endpoints.working.initiate())
        expect(reportError).not.toHaveBeenCalled()
    })

    it('decides by status', () => {
        expect(shouldReportApiError({ status: 'CUSTOM_ERROR' })).toBe(true)
        expect(shouldReportApiError({ status: 401 })).toBe(false)
        expect(shouldReportApiError(undefined)).toBe(true)
    })
})
