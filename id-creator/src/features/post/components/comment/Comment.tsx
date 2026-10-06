'use client'
import React, { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Editor, EditorProvider } from "react-simple-wysiwyg"
import { IComment } from "features/post/types/IComment"
import "./Comment.css";
import "../shared/Style.css";
import Spinner from "components/ui/spinner/Spinner";
import formatDisplayDate from "utils/formatDisplayDate";
import BusyButton from "components/ui/busyButton/BusyButton";
import AuthorBadge from "features/post/components/authorBadge/AuthorBadge";

function Comment({comment}:{comment:IComment}){
    return <div className="post-comment-container post-page-element-container">
    <div className="center-element post-comment-content">
        <div className="center-element post-comment-header">
            <div className="center-element">
                <AuthorBadge userId={comment.userId} userName={comment.userName} userIcon={comment.userIcon} size={32} iconClassName="post-author-icon-small"/>
            </div>
        </div>
        <p className="post-date">Posted: {formatDisplayDate(comment.created)}</p>
        <p className="description-txt" dangerouslySetInnerHTML={{__html:comment.content}}></p>
    </div>
</div>
}

export function CommentContainer({comments,loadMore,isLoading,hasMore}:{comments:IComment[],loadMore:()=>void,isLoading:boolean,hasMore:boolean}){
    const loaderRef = useRef(null)
    const loadMoreRef = useRef(loadMore)
    const isLoadingRef = useRef(isLoading)
    const hasMoreRef = useRef(hasMore)

    useEffect(()=>{
        loadMoreRef.current = loadMore
        isLoadingRef.current = isLoading
        hasMoreRef.current = hasMore
    })

    useEffect(()=>{
        const observer = new IntersectionObserver((entries)=>{
            const target = entries[0]
            if(target.isIntersecting && !isLoadingRef.current && hasMoreRef.current){
                loadMoreRef.current()
            }
        })

        if(loaderRef.current){
            observer.observe(loaderRef.current)
        }
        return () => observer.disconnect()
    },[])

    return <>
        {comments.map((comment,i)=><Comment key={i} comment={comment}/>)}
        {hasMore && <div ref={loaderRef}>{isLoading&&<Spinner/>}</div>}
    </>
}

export function PostCommentInput({authorIcon,authorName,createComment}:{authorIcon:string,authorName:string,createComment:(comment:string)=>Promise<void>}){
    const [commentValue,setCommentValue] = useState("")
    const [isPosting,setIsPosting] = useState(false)

    const postFnc = ()=>{
        if(!isPosting){
            setIsPosting(true)
            createComment(commentValue).finally(()=>{
                setIsPosting(false)
                setCommentValue("")
            })
        }
    }

    return<div className="center-element post-comment-content post-page-element-container">
        <div className="center-element">
            <Image className="post-author-icon-small" src={authorIcon} alt={authorName+" avatar"} width={32} height={32} />
            <p className="post-author-name">{authorName}</p>
        </div>
        {/* The named Editor needs a provider (it used to be global in App/Provider.tsx) */}
        <EditorProvider>
            <Editor className="input comment-input" name="comment" id="comment" value={commentValue} onChange={(e)=>setCommentValue(e.target.value)}/>
        </EditorProvider>
        <BusyButton busy={isPosting} busyText="Posting..." onClick={postFnc}>Post</BusyButton>
    </div>
}