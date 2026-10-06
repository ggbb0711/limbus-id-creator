import { BaseApi } from "api/BaseApi";
import IResponse from "types/IResponse";
import { IPost } from "features/post/types/IPost";
import { toPostDisplayCard } from "features/post/utils/toPostDisplayCard";
import { buildPostsQuery } from "features/post/api/buildPostsQuery";
import { GetPostsParams, ICreatePostBody } from "features/post/types/PostRequests";
import { IPostList } from "features/post/types/IPostList";


export const transformPostsResponse = (response: IResponse<IPostList<IPost>>): IPostList => ({
    list: response.data.list.map(toPostDisplayCard),
    total: response.data.total,
})

export const PostApi = BaseApi.injectEndpoints({
    endpoints: (builder) => ({
        getPosts: builder.query<IPostList, GetPostsParams>({
            query: (params) => `/Post?${buildPostsQuery(params)}`,
            transformResponse: transformPostsResponse,
            providesTags: ['Posts'],
        }),

        getPost: builder.query<IPost, string>({
            query: (postId) => `/Post/${encodeURIComponent(postId)}`,
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
