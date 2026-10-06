import { BaseApi } from "api/BaseApi";
import IResponse from "types/IResponse";
import { IUserProfile } from "features/user/types/IUserProfile";
import type { RootState } from "stores/AppStore";
import { updateSessionUser } from "stores/slices/AuthSlice";

export const sessionUserUpdate = (sessionUser: { id: string } | null, userId: string, profile: IUserProfile) =>
    sessionUser?.id === userId ? updateSessionUser({ userName: profile.userName, userIcon: profile.userIcon }) : null

export interface UpdateUserArgs {
    userId: string
    name: string
    iconFile?: File
}

const UserApi = BaseApi.injectEndpoints({
    endpoints: (builder) => ({
        getUser: builder.query<IUserProfile, string>({
            query: (userId) => `/User/${encodeURIComponent(userId)}`,
            transformResponse: (response: IResponse<IUserProfile>) => response.data,
            providesTags: (result, error, userId) => [{ type: 'User', id: userId }],
        }),

        updateUser: builder.mutation<IUserProfile, UpdateUserArgs>({
            query: ({ userId, name, iconFile }) => {
                const form = new FormData()
                form.append('UserName', name)
                if (iconFile) form.append('UserIconFile', iconFile)
                return {
                    url: `/User/${encodeURIComponent(userId)}`,
                    method: 'PUT',
                    body: form,
                }
            },
            transformResponse: (response: IResponse<IUserProfile>) => response.data,
            invalidatesTags: (result, error, { userId }) => [{ type: 'User', id: userId }],
            async onQueryStarted({ userId }, { dispatch, queryFulfilled, getState }) {
                try {
                    const { data } = await queryFulfilled
                    const update = sessionUserUpdate((getState() as RootState).auth.user, userId, data)
                    if (update) dispatch(update)
                } catch {
                    return
                }
            },
        }),
    }),
})

export const { useGetUserQuery, useUpdateUserMutation } = UserApi
