'use client'
import React, { useState, useCallback, ReactNode } from "react";
import { ReactElement } from "react";
import Post from "features/post/components/post/Post";
import { useLoginMenu } from "hooks/useLoginMenu";
import { CommentContainer, PostCommentInput } from "features/post/components/comment/Comment";
import useAlert from "hooks/useAlert";
import { useAuth } from "hooks/useAuth";
import { useGetPostQuery } from "api/PostAPI";
import { IPost } from "types/iPost/IPost";
import { IComment } from "types/iPost/IComment";
import { useGetCommentsQuery, useCreateCommentMutation } from "api/CommentApi";
import getApiErrorMessage from "utils/getApiErrorMessage";

export default function PostPage({initialPost,initialComments=[],sidebar}:{initialPost:IPost,initialComments?:IComment[],sidebar?:ReactNode}):ReactElement{
    const postId = initialPost.id
    const {addAlert} = useAlert()
    const {user: loginUser, isInitializing} = useAuth()
    const {setIsLoginMenuActive} = useLoginMenu()
    const [commentPage, setCommentPage] = useState(0)

    const { data: post = initialPost } = useGetPostQuery(postId, { skip: isInitializing })
    const { data: comments = initialComments, isFetching: isFetchingComments } = useGetCommentsQuery({
        postId,
        page: commentPage,
        limit: 10,
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

    return <div className="post-page-layout">
        <div className="page-content post-page-post">
            <Post post={post} isLoading={false}/>
        </div>
        {sidebar&&<div className="post-page-sidebar">{sidebar}</div>}
        <div className="post-page-comments">
        <div className="page-content">
            <CommentContainer comments={comments} loadMore={loadMoreComments} isLoading={isFetchingComments} hasMore={hasMore}/>
        </div>
        <div className="page-content">
            {(()=>{
                if(loginUser && post) return <PostCommentInput authorIcon={loginUser.userIcon} authorName={loginUser.userName} createComment={createNewComment}/>
                if(post) return <button className="main-button" onClick={()=>setIsLoginMenuActive(true)}>Login to comment</button>
                return <></>
            })()}
        </div>
        </div>
    </div>
}