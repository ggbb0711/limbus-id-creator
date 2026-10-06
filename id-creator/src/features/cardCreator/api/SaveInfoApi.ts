import { appConfig } from "config/env.client";
import { BaseApi } from "api/BaseApi";
import { SaveMode } from "features/cardCreator/constants";
import { ISaveFile } from "features/cardCreator/types/ISaveFile";
import { IIdInfo } from "features/cardCreator/types/IIdInfo";
import { IEgoInfo } from "features/cardCreator/types/IEgoInfo";
import { unwrapData } from "api/unwrapData";

function getSaveEndpoint(saveMode: SaveMode): string {
    return saveMode === 'ID' ? 'SaveIDInfo' : 'SaveEGOInfo'
}
function getSaveTag(saveMode: SaveMode): 'SaveIDInfo' | 'SaveEGOInfo' {
    return saveMode === 'ID' ? 'SaveIDInfo' : 'SaveEGOInfo'
}

const SaveInfoApi = BaseApi.injectEndpoints({
    endpoints: (builder) => ({
        getSaveList: builder.query<ISaveFile<IIdInfo | IEgoInfo>[], { userId: string, searchName: string, saveMode: SaveMode, page?: number, limit?: number }>({
            query: ({ userId, searchName, saveMode, page = 0, limit = appConfig.paging.cloudSavesPerPage }) =>
                `/${getSaveEndpoint(saveMode)}?${new URLSearchParams({ userId, searchName, page: String(page), limit: String(limit) })}`,
            transformResponse: unwrapData<ISaveFile<IIdInfo | IEgoInfo>[]>,
            providesTags: (result, error, { saveMode }) => [getSaveTag(saveMode)],
        }),
        getSave: builder.query<ISaveFile<IIdInfo | IEgoInfo>, { saveId: string, saveMode: SaveMode }>({
            query: ({ saveId, saveMode }) =>
                `/${getSaveEndpoint(saveMode)}/${encodeURIComponent(saveId)}?includeSkill=true`,
            transformResponse: unwrapData<ISaveFile<IIdInfo | IEgoInfo>>,
        }),
        createSave: builder.mutation<void, { saveMode: SaveMode, form: FormData }>({
            query: ({ saveMode, form }) => ({ url: `/${getSaveEndpoint(saveMode)}`, method: 'POST', body: form }),
            invalidatesTags: (result, error, { saveMode }) => [getSaveTag(saveMode)],
        }),
        updateSave: builder.mutation<void, { saveMode: SaveMode, form: FormData }>({
            query: ({ saveMode, form }) => ({ url: `/${getSaveEndpoint(saveMode)}`, method: 'PUT', body: form }),
            invalidatesTags: (result, error, { saveMode }) => [getSaveTag(saveMode)],
        }),
        deleteSave: builder.mutation<void, { saveMode: SaveMode, saveId: string }>({
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
