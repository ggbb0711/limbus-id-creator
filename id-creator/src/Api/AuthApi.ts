import { ILoginUser } from "Types/API/OAuth/ILoginUser";
import { BaseApi } from "./BaseApi";
import IResponse from "Types/IResponse";


export const AuthApi = BaseApi.injectEndpoints({
    endpoints: (builder)=>({
        checkAuth: builder.query<ILoginUser | null,void>({
            query: ()=>({
                url: '/OAuth/oauth2/login',
                method: 'POST',
                credentials: "include",
            }),
            transformResponse: (response: IResponse<ILoginUser>) => response.response,
            transformErrorResponse: ()=> null,
        }),
        register: builder.mutation<ILoginUser,string>({
            query: (accessToken)=>({
                url: '/OAuth/oauth2/register',
                method: "POST",
                credentials: "include",
                headers:{
                    "Content-type":"application/json"
                },
                body: accessToken,
            }),
            transformResponse: (response: IResponse<ILoginUser>) => response.response,
            async onQueryStarted(_, { dispatch, queryFulfilled }){
                const { data } = await queryFulfilled;
                dispatch(AuthApi.util.upsertQueryData('checkAuth', undefined, data));
            }
        }),
        logOut: builder.mutation<void,void>({
            query: ()=>({
                url: '/OAuth/oauth2/logout',
                method: "POST",
                credentials: "include",
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }){
                await queryFulfilled;
                dispatch(AuthApi.util.upsertQueryData('checkAuth', undefined, null));
            }
        })
    })
})

export const {useCheckAuthQuery,useRegisterMutation,useLogOutMutation} = AuthApi