import { BaseApi } from "./BaseApi";
import IResponse from "Types/IResponse";
import { ISaveFile } from "Types/ISaveFile";
import { IIdInfo } from "Features/CardCreator/Types/IIdInfo";
import { IEgoInfo } from "Features/CardCreator/Types/IEgoInfo";

function getSaveEndpoint(saveMode: string): string {
    return saveMode === 'ID' ? 'SaveIDInfo' : 'SaveEGOInfo'
}
function getSaveTag(saveMode: string): 'SaveIDInfo' | 'SaveEGOInfo' {
    return saveMode === 'ID' ? 'SaveIDInfo' : 'SaveEGOInfo'
}

const SaveInfoApi = BaseApi.injectEndpoints({
    endpoints: (builder) => ({
        getSaveList: builder.query<ISaveFile<IIdInfo | IEgoInfo>[], { userId: string, searchName: string, saveMode: string, page?: number, limit?: number }>({
            query: ({ userId, searchName, saveMode, page = 0, limit = 50 }) =>
                `/${getSaveEndpoint(saveMode)}?userId=${userId}&searchName=${searchName}&page=${page}&limit=${limit}`,
            transformResponse: (response: IResponse<ISaveFile<IIdInfo | IEgoInfo>[]>) => response.data,
            providesTags: (result, error, { saveMode }) => [getSaveTag(saveMode)],
        }),
        getSave: builder.query<ISaveFile<IIdInfo | IEgoInfo>, { saveId: string, saveMode: string }>({
            query: ({ saveId, saveMode }) =>
                `/${getSaveEndpoint(saveMode)}/${saveId}?includeSkill=true`,
            transformResponse: (response: IResponse<ISaveFile<IIdInfo | IEgoInfo>>) => response.data,
        }),
        createSave: builder.mutation<void, { saveMode: string, form: FormData }>({
            query: ({ saveMode, form }) => ({ url: `/${getSaveEndpoint(saveMode)}`, method: 'POST', body: form }),
            invalidatesTags: (result, error, { saveMode }) => [getSaveTag(saveMode)],
        }),
        updateSave: builder.mutation<void, { saveMode: string, form: FormData }>({
            query: ({ saveMode, form }) => ({ url: `/${getSaveEndpoint(saveMode)}`, method: 'PUT', body: form }),
            invalidatesTags: (result, error, { saveMode }) => [getSaveTag(saveMode)],
        }),
        deleteSave: builder.mutation<void, { saveMode: string, saveId: string }>({
            query: ({ saveMode, saveId }) => ({
                url: `/${getSaveEndpoint(saveMode)}`,
                method: 'DELETE',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify(saveId),
            }),
            invalidatesTags: (result, error, { saveMode }) => [getSaveTag(saveMode)],
        }),
    }),
})

export const {
    useGetSaveListQuery, useGetSaveQuery, useLazyGetSaveQuery,
    useCreateSaveMutation, useUpdateSaveMutation, useDeleteSaveMutation,
} = SaveInfoApi
