import { createApi, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs } from '@reduxjs/toolkit/query/react';
import { EnvironmentVariables } from 'Config/Environments';
import { RootState } from 'Stores/AppStore';
import { setCredentials, clearCredentials } from 'Stores/Slices/AuthSlice';
import IResponse from 'Types/IResponse';
import { AuthResponseDTO } from 'Types/API/Auth/IAuthResponse';

const rawBaseQuery = fetchBaseQuery({
    baseUrl: EnvironmentVariables.REACT_APP_SERVER_URL + "/API",
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.accessToken
        if (token) headers.set('Authorization', `Bearer ${token}`)
        return headers
    },
})

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> =
    async (args, api, extraOptions) => {
        let result = await rawBaseQuery(args, api, extraOptions)

        if (result.error && result.error.status === 401) {
            const refreshResult = await rawBaseQuery(
                { url: '/Auth/refresh', method: 'POST' },
                api,
                extraOptions
            )

            const refreshBody = refreshResult.data as IResponse<AuthResponseDTO> | undefined
            if (refreshBody?.success && refreshBody.data) {
                api.dispatch(setCredentials({
                    accessToken: refreshBody.data.accessToken,
                    user: refreshBody.data.userSessionProfile,
                }))
                result = await rawBaseQuery(args, api, extraOptions)
            } else {
                api.dispatch(clearCredentials())
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
