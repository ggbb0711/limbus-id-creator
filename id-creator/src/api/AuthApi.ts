import { BaseApi, refreshSession } from "./BaseApi";
import { unwrapData } from "./unwrapData";
import { AuthResponseDTO } from "types/auth/IAuthResponse";
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
            transformResponse: unwrapData<AuthResponseDTO>,
            async onQueryStarted(_, { dispatch, queryFulfilled }){
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setCredentials({ accessToken: data.accessToken, user: data.userSessionProfile }));
                } catch {
                    return
                }
            }
        }),
        refresh: builder.mutation<boolean,void>({
            queryFn: async (_arg, api, extraOptions) => ({ data: await refreshSession(api, extraOptions) }),
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
                catch{
                    return
                }
                finally{
                    endSession(dispatch);
                }
            }
        })
    })
})

export const {useLoginWithGoogleMutation,useRefreshMutation,useLogOutMutation} = AuthApi
