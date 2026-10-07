import { BaseApi } from "api/BaseApi";
import { PostApi } from "features/post/api/PostApi";
import IResponse from "types/IResponse";
import { IComment, ICommentPage, ICreateCommentBody, IGetCommentsParams } from "features/post/types/IComment";
import { appendCreatedComment, mergeCommentPage, toCommentPage, toWallClock } from "features/post/utils/comments";

const CommentApi = BaseApi.injectEndpoints({
    endpoints: (builder) => ({
        getComments: builder.query<ICommentPage, IGetCommentsParams>({
            query: ({ postId, page, limit }) => `/Comment/post/${encodeURIComponent(postId)}?${new URLSearchParams({ page: String(page), limit: String(limit) })}`,
            transformResponse: (response: IResponse<IComment[]>, _meta, { limit }) => toCommentPage(response.data ?? [], limit),
            serializeQueryArgs: ({ queryArgs }) => queryArgs.postId,
            merge: (currentCache, incoming, { arg }) => mergeCommentPage(currentCache, incoming, arg.page),
            forceRefetch: ({ currentArg, previousArg }) => currentArg !== previousArg,
            providesTags: (result, error, { postId }) => [{ type: 'Comment', id: postId }],
        }),

        createComment: builder.mutation<IComment, ICreateCommentBody>({
            query: (body) => ({
                url: '/Comment',
                method: 'POST',
                body,
            }),
            transformResponse: (response: IResponse<IComment>) => ({ ...response.data, created: toWallClock(response.data.created) }),
            async onQueryStarted({ postId }, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled
                    dispatch(CommentApi.util.updateQueryData('getComments', { postId, page: 0, limit: 0 }, draft => appendCreatedComment(draft, data)))
                    dispatch(PostApi.util.updateQueryData('getPost', postId, draft => {
                        draft.commentCount += 1
                    }))
                } catch {
                    return
                }
            },
        }),
    }),
})

export const { useGetCommentsQuery, useCreateCommentMutation } = CommentApi
