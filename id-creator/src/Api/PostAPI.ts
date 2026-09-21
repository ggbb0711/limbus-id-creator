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
    list: (IPost & { imagesAttach: string[] })[]
    total: number
}

interface ICreatePostBody {
    id: string
    title: string
    description: string
    imagesAttach: string[]
    userId: string
    tags: string[]
}

const PostApi = BaseApi.injectEndpoints({
    endpoints: (builder) => ({
        getPosts: builder.query<IGetPostsResponse, IGetPostsParams>({
            query: ({ title = '', tag = [], sortedBy = PostSortOptions[PostSortOptions.Latest], page, limit, userId }) => {
                const tagString = tag.map(tag=>"Tag="+tag).join("&")
                let url = `/Post?Title=${title}&SortedBy=${sortedBy}&page=${page}&limit=${limit}&${tagString}`
                if (userId) url += `&UserId=${userId}`
                return url
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