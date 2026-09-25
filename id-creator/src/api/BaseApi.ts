import { createApi, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs } from '@reduxjs/toolkit/query/react';
import { clientEnv } from 'config/env.client';
import { RootState } from 'stores/AppStore';
import { setCredentials, clearCredentials } from 'stores/slices/AuthSlice';
import IResponse from 'types/IResponse';
import { AuthResponseDTO } from 'types/api/auth/IAuthResponse';

const rawBaseQuery = fetchBaseQuery({
    baseUrl: clientEnv.serverUrl + "/API",
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.accessToken
        if (token) headers.set('Authorization', `Bearer ${token}`)
        return headers
    },
})

const REFRESH_URL = '/Auth/refresh'

// The backend rotates the session on every refresh, so concurrent 401s must share one refresh:
// a second refresh sent with the old cookie would be rejected and log the user out.
let refreshInFlight: Promise<boolean> | null = null

function refreshSession(api: Parameters<BaseQueryFn>[1], extraOptions: object): Promise<boolean> {
    if (!refreshInFlight) {
        refreshInFlight = (async () => {
            const refreshResult = await rawBaseQuery({ url: REFRESH_URL, method: 'POST' }, api, extraOptions)
            const refreshBody = refreshResult.data as IResponse<AuthResponseDTO> | undefined
            if (refreshBody?.success && refreshBody.data) {
                api.dispatch(setCredentials({
                    accessToken: refreshBody.data.accessToken,
                    user: refreshBody.data.userSessionProfile,
                }))
                return true
            }
            api.dispatch(clearCredentials())
            return false
        })().finally(() => { refreshInFlight = null })
    }
    return refreshInFlight
}

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> =
    async (args, api, extraOptions) => {
        let result = await rawBaseQuery(args, api, extraOptions)

        // Don't refresh in response to the refresh endpoint's own 401 (that would rotate twice)
        const url = typeof args === 'string' ? args : args.url
        if (result.error && result.error.status === 401 && url !== REFRESH_URL) {
            if (await refreshSession(api, extraOptions)) {
                result = await rawBaseQuery(args, api, extraOptions)
            }
        }

        return result
    }

export const BaseApi = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Post', 'Posts', 'Comment', 'User', 'SaveIDInfo', 'SaveEGOInfo', 'Auth'],
    endpoints: ()=>({}),
});
