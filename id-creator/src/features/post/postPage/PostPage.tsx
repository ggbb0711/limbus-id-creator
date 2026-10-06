'use client'
import { appConfig } from "config/env.client";
import React, { useState, useCallback } from "react";
import { ReactElement } from "react";
import Post from "features/post/components/post/Post";
import { CommentContainer, PostCommentInput } from "features/post/components/comment/Comment";
import { useAddAlert } from "hooks/useAddAlert";
import { useAuth } from "hooks/useAuth";
import { useGetPostQuery } from "features/post/api/PostApi";
import { IPost } from "features/post/types/IPost";
import { useGetCommentsQuery, useCreateCommentMutation } from "features/post/api/CommentApi";
import getApiErrorMessage from "api/getApiErrorMessage";
import LoginPromptButton from "components/loginMenu/LoginPromptButton";

export default function PostPage({initialPost}:{initialPost:IPost}):ReactElement{
    const postId = initialPost.id
    const addAlert = useAddAlert()
    const {user: loginUser, isInitializing} = useAuth()
    const [commentPage, setCommentPage] = useState(0)

    // Wait for AuthBootstrap so the view is attributed to the logged-in user
    const { data: post = initialPost } = useGetPostQuery(postId, { skip: isInitializing })
    const { data: comments = [], isFetching: isFetchingComments } = useGetCommentsQuery({
        postId,
        page: commentPage,
        limit: appConfig.paging.commentsPerPage,
    })

    const hasMore = post ? comments.length < post.commentCount : true

    const [createComment] = useCreateCommentMutation()

    async function createNewComment(comment:string):Promise<void>{
        if(!comment) {
            addAlert("Failure","Comment cannot be emptied")
            return
        }
        if(!loginUser){
            addAlert("Failure","You must be logged in to comment")
            return
        }
        try {
            await createComment({
                postId: post!.id,
                content: comment,
            }).unwrap()
            addAlert("Success","Comment posted")
        } catch (error) {
            addAlert("Failure",getApiErrorMessage(error))
        }
    }

    const loadMoreComments = useCallback(()=>{
        setCommentPage(prev => prev + 1)
    },[])

    return <div className="page-container">
        <div className="page-content">
            <Post post={post} isLoading={false}/>
        </div>
        <div className="page-content">
            <CommentContainer comments={comments} loadMore={loadMoreComments} isLoading={isFetchingComments} hasMore={hasMore}/>
        </div>
        <div className="page-content">
            {(()=>{
                if(loginUser && post) return <PostCommentInput authorIcon={loginUser.userIcon} authorName={loginUser.userName} createComment={createNewComment}/>
                if(post) return <LoginPromptButton>Login to comment</LoginPromptButton>
                return <></>
            })()}
        </div>
    </div>
}