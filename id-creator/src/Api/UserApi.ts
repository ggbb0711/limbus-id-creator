import { BaseApi } from "./BaseApi";
import IResponse from "Types/IResponse";
import { IUserProfile } from "Types/API/OAuth/IUserProfile";

const UserApi = BaseApi.injectEndpoints({
    endpoints: (builder) => ({
        getUser: builder.query<IUserProfile, string>({
            query: (userId) => `/User/${userId}`,
            transformResponse: (response: IResponse<IUserProfile>) => response.data,
            providesTags: (result, error, userId) => [{ type: 'User', id: userId }],
        }),

        updateUser: builder.mutation<IUserProfile, { userId: string, name: string, iconFile?: File }>({
            query: ({ userId, name, iconFile }) => {
                const form = new FormData()
                form.append('UserName', name)
                if (iconFile) form.append('UserIconFile', iconFile)
                return {
                    url: `/User/${userId}`,
                    method: 'PUT',
                    body: form,
                }
            },
            transformResponse: (response: IResponse<IUserProfile>) => response.data,
            invalidatesTags: (result, error, { userId }) => [{ type: 'User', id: userId }],
        }),
    }),
})

export const { useGetUserQuery, useUpdateUserMutation } = UserApi
