import { BaseApi } from "./BaseApi";
import IResponse from "types/IResponse";
import { AuthResponseDTO, UserSessionProfileDTO } from "types/auth/IAuthResponse";
import { setCredentials, clearCredentials } from "stores/slices/AuthSlice";
import type { Dispatch } from "@reduxjs/toolkit";

export function endSession(dispatch: Dispatch) {
    dispatch(clearCredentials())
    dispatch(BaseApi.util.resetApiState())
}

export const AuthApi = BaseApi.injectEndpoints({
    endpoints: (builder)=>({
        loginWithGoogle: builder.mutation<AuthResponseDTO,string>({
            query: (code)=>({
                url: '/Auth/oauth/google',
                method: "POST",
                headers:{
                    "Content-type":"application/json"
                },
                body: code,
            }),
            transformResponse: (response: IResponse<AuthResponseDTO>) => response.data,
            async onQueryStarted(_, { dispatch, queryFulfilled }){
                const { data } = await queryFulfilled;
                dispatch(setCredentials({ accessToken: data.accessToken, user: data.userSessionProfile }));
            }
        }),
        refresh: builder.mutation<AuthResponseDTO,void>({
            query: ()=>({
                url: '/Auth/refresh',
                method: "POST",
            }),
            transformResponse: (response: IResponse<AuthResponseDTO>) => response.data,
            async onQueryStarted(_, { dispatch, queryFulfilled }){
                try{
                    const { data } = await queryFulfilled;
                    dispatch(setCredentials({ accessToken: data.accessToken, user: data.userSessionProfile }));
                }
                catch{
                    dispatch(clearCredentials());
                }
            }
        }),
        getAuthStatus: builder.query<UserSessionProfileDTO,void>({
            query: ()=>'/Auth/status',
            transformResponse: (response: IResponse<UserSessionProfileDTO>) => response.data,
        }),
        logOut: builder.mutation<void,void>({
            query: ()=>({
                url: '/Auth/logout',
                method: "POST",
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }){
                try{
                    await queryFulfilled;
                }
                finally{
                    endSession(dispatch);
                }
            }
        })
    })
})

export const {useLoginWithGoogleMutation,useRefreshMutation,useGetAuthStatusQuery,useLogOutMutation} = AuthApi
