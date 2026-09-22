import React, { useState, useCallback } from "react";
import { ReactElement } from "react";
import Post from "Features/Post/Components/Post/Post";
import { useParams } from "react-router-dom";
import { useLoginMenu } from "Hooks/useLoginMenu";
import { CommentContainer, PostCommentInput } from "Features/Post/Components/Comment/Comment";
import "../Shared/Styles/PageLayout.css"
import useAlert from "Hooks/useAlert";
import { useAuth } from "Hooks/useAuth";
import { useGetPostQuery } from "Api/PostAPI";
import { useGetCommentsQuery, useCreateCommentMutation } from "Api/CommentApi";
import getApiErrorMessage from "Utils/getApiErrorMessage";

export default function PostPage():ReactElement{
    const {postId} = useParams()
    const {addAlert} = useAlert()
    const {user: loginUser} = useAuth()
    const {setIsLoginMenuActive} = useLoginMenu()
    const [commentPage, setCommentPage] = useState(0)
    const { data: post, isLoading: isLoadingPost } = useGetPostQuery(postId!)
    const { data: comments = [], isFetching: isFetchingComments } = useGetCommentsQuery({
        postId: postId!,
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

    return <div className="page-container">
        <div className="page-content">
            <Post post={post ?? null} isLoading={isLoadingPost}/>
        </div>
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
}