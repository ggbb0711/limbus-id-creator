import { BaseApi } from "./BaseApi";
import IResponse from "Types/IResponse";
import { IPost } from "Types/IPost/IPost";
import { PostSortOptions } from "Types/Enums/PostSortOptions";

interface IGetPostsParams {
    title?: string
    tag?: string[]
    sortedBy?: PostSortOptions
    page: number
    limit: number
    userId?: string
}

interface IGetPostsResponse {
    list: IPost[]
    total: number
}

interface ICreatePostBody {
    title: string
    description: string
    imagesAttach: string[]
    tags: string[]
}

export const PostApi = BaseApi.injectEndpoints({
    endpoints: (builder) => ({
        getPosts: builder.query<IGetPostsResponse, IGetPostsParams>({
            query: ({ title = '', tag = [], sortedBy = PostSortOptions.Latest, page, limit, userId }) => {
                const params = new URLSearchParams({
                    Title: title,
                    SortedBy: PostSortOptions[sortedBy],
                    page: page.toString(),
                    limit: limit.toString(),
                })
                tag.forEach(t => params.append('Tag', t))
                if (userId) params.append('UserId', userId)
                return `/Post?${params.toString()}`
            },
            transformResponse: (response: IResponse<IGetPostsResponse>) => response.data,
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
