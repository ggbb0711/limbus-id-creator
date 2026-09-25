import { BaseApi } from "./BaseApi";
import { PostApi } from "./PostAPI";
import IResponse from "types/IResponse";
import { IComment } from "types/iPost/IComment";

interface IGetCommentsParams {
    postId: string
    page: number
    limit: number
}

interface ICreateCommentBody {
    postId: string
    content: string
}

// Comments have no id, so identify them by author + creation time
const commentKey = (c: IComment) => c.userId + c.created

const CommentApi = BaseApi.injectEndpoints({
    endpoints: (builder) => ({
        getComments: builder.query<IComment[], IGetCommentsParams>({
            query: ({ postId, page, limit }) => `/Comment/post/${postId}?page=${page}&limit=${limit}`,
            transformResponse: (response: IResponse<IComment[]>) => response.data,
            serializeQueryArgs: ({ queryArgs }) => queryArgs.postId,
            merge: (currentCache, newItems, { arg }) => {
                if (arg.page === 0) return newItems
                const existing = new Set(currentCache.map(commentKey))
                currentCache.push(...newItems.filter(c => !existing.has(commentKey(c))))
            },
            forceRefetch: ({ currentArg, previousArg }) => currentArg !== previousArg,
            providesTags: (result, error, { postId }) => [{ type: 'Comment', id: postId }],
        }),

        createComment: builder.mutation<IComment, ICreateCommentBody>({
            query: (body) => ({
                url: '/Comment',
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body,
            }),
            transformResponse: (response: IResponse<IComment>) => response.data,
            async onQueryStarted({ postId }, { dispatch, queryFulfilled }) {
                const { data } = await queryFulfilled
                dispatch(CommentApi.util.updateQueryData('getComments', { postId, page: 0, limit: 10 }, draft => {
                    draft.push(data)
                }))
                dispatch(PostApi.util.updateQueryData('getPost', postId, draft => {
                    draft.commentCount += 1
                }))
            },
        }),
    }),
})

export const { useGetCommentsQuery, useCreateCommentMutation } = CommentApi
