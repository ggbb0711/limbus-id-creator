import { BaseApi } from "api/BaseApi";
import IResponse from "types/IResponse";
import { IPost } from "features/post/types/IPost";
import { toPostDisplayCard } from "features/post/utils/toPostDisplayCard";
import { buildPostsQuery } from "features/post/api/buildPostsQuery";
import { GetPostsParams, ICreatePostBody, IUpdatePostBody } from "features/post/types/PostRequests";
import { IPostList } from "features/post/types/IPostList";
import { unwrapData } from "api/unwrapData";


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
            transformResponse: unwrapData<IPost>,
            providesTags: (result, error, postId) => [{ type: 'Post', id: postId }],
        }),

        createPost: builder.mutation<IPost, ICreatePostBody>({
            query: (body) => ({
                url: '/Post',
                method: 'POST',
                body,
            }),
            transformResponse: unwrapData<IPost>,
            invalidatesTags: ['Posts', 'SaveIDInfo', 'SaveEGOInfo'],
        }),

        updatePost: builder.mutation<IPost, { id: string, body: IUpdatePostBody }>({
            query: ({ id, body }) => ({
                url: `/Post/${encodeURIComponent(id)}`,
                method: 'PUT',
                body,
            }),
            transformResponse: unwrapData<IPost>,
            invalidatesTags: (result, error, { id }) => [{ type: 'Post', id }, 'Posts', 'SaveIDInfo', 'SaveEGOInfo'],
        }),

        deletePost: builder.mutation<string, string>({
            query: (id) => ({
                url: `/Post/${encodeURIComponent(id)}`,
                method: 'DELETE',
            }),
            transformResponse: unwrapData<string>,
            invalidatesTags: (result, error, id) => [{ type: 'Post', id }, 'Posts', 'SaveIDInfo', 'SaveEGOInfo'],
        }),
    }),
})

export const { useGetPostsQuery, useGetPostQuery, useCreatePostMutation, useUpdatePostMutation, useDeletePostMutation } = PostApi
