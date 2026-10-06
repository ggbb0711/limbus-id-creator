'use client'
import { appConfig } from "config/env.client";
import React, { ReactElement, useCallback, useState } from "react";
import { CommentContainer, PostCommentInput } from "features/post/components/comment/Comment";
import { useAddAlert } from "hooks/useAddAlert";
import { useAuth } from "hooks/useAuth";
import { useCreateCommentMutation, useGetCommentsQuery } from "features/post/api/CommentApi";
import getApiErrorMessage from "api/getApiErrorMessage";
import LoginPromptButton from "components/loginMenu/LoginPromptButton";
import stripHtml from "utils/stripHtml";

export default function PostComments({ postId }: { postId: string }): ReactElement {
    const addAlert = useAddAlert()
    const { user: loginUser, isInitializing } = useAuth()
    const [commentPage, setCommentPage] = useState(0)

    const { data, isFetching, error, refetch } = useGetCommentsQuery({
        postId,
        page: commentPage,
        limit: appConfig.paging.commentsPerPage,
    })
    const [createComment] = useCreateCommentMutation()

    const loadMoreComments = useCallback(() => setCommentPage(prev => prev + 1), [])

    async function createNewComment(comment: string): Promise<boolean> {
        if (!stripHtml(comment).trim()) {
            addAlert("Failure", "Comment cannot be empty")
            return false
        }
        try {
            await createComment({ postId, content: comment }).unwrap()
            addAlert("Success", "Comment posted")
            return true
        } catch (createError) {
            addAlert("Failure", getApiErrorMessage(createError))
            return false
        }
    }

    return <>
        <div className="page-content">
            <CommentContainer comments={data?.list ?? []} loadMore={loadMoreComments} isLoading={isFetching}
                hasMore={data?.hasMore ?? true} error={error} onRetry={refetch}/>
        </div>
        <div className="page-content">
            {isInitializing ? null : loginUser ?
                <PostCommentInput authorIcon={loginUser.userIcon} authorName={loginUser.userName} createComment={createNewComment}/> :
                <LoginPromptButton>Login to comment</LoginPromptButton>}
        </div>
    </>
}
