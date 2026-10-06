import { BaseApi } from "api/BaseApi";
import IResponse from "types/IResponse";
import { IPost } from "features/post/types/IPost";
import { IPostDisplayCard } from "features/post/types/IPostDisplayCard";
import { toPostDisplayCard } from "features/post/utils/toPostDisplayCard";
import { GetPostsFilter, GetPostsParams, buildPostsQuery } from "features/post/api/buildPostsQuery";

export type { GetPostsFilter }

export interface IGetPostsResponse<T> {
    list: T[]
    total: number
}

export const transformPostsResponse = (response: IResponse<IGetPostsResponse<IPost>>): IGetPostsResponse<IPostDisplayCard> => ({
    list: response.data.list.map(toPostDisplayCard),
    total: response.data.total,
})

interface ICreatePostBody {
    title: string
    description: string
    imagesAttach: string[]
    tags: string[]
}

export const PostApi = BaseApi.injectEndpoints({
    endpoints: (builder) => ({
        getPosts: builder.query<IGetPostsResponse<IPostDisplayCard>, GetPostsParams>({
            query: (params) => `/Post?${buildPostsQuery(params)}`,
            transformResponse: transformPostsResponse,
            providesTags: ['Posts'],
        }),

        getPost: builder.query<IPost, string>({
            query: (postId) => `/Post/${postId}`,
            transformResponse: (response: IResponse<IPost>) => response.data,
            providesTags: (result, error, postId) => [{ type: 'Post', id: postId }],
        }),

        createPost: builder.mutation<IPost, ICreatePostBody>({
            query: (body) => ({
                url: '/Post',
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body,
            }),
            transformResponse: (response: IResponse<IPost>) => response.data,
            invalidatesTags: ['Posts'],
        }),
    }),
})

export const { useGetPostsQuery, useGetPostQuery, useCreatePostMutation } = PostApi
