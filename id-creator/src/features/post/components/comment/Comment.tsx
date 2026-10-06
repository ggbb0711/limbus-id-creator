'use client'
import React, { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Editor, EditorProvider } from "react-simple-wysiwyg"
import { IComment } from "features/post/types/IComment"
import { commentKey } from "features/post/utils/comments"
import "./Comment.css";
import "../shared/Style.css";
import Spinner from "components/ui/spinner/Spinner";
import formatDisplayDate from "utils/formatDisplayDate";
import BusyButton from "components/ui/busyButton/BusyButton";
import AuthorBadge from "features/post/components/authorBadge/AuthorBadge";
import { sanitizePostHtml } from "utils/sanitizeHtml"

function Comment({ comment }: { comment: IComment }) {
    return <div className="post-comment-container post-page-element-container">
        <div className="center-element post-comment-content">
            <div className="center-element post-comment-header">
                <div className="center-element">
                    <AuthorBadge userId={comment.userId} userName={comment.userName} userIcon={comment.userIcon} size={32} iconClassName="post-author-icon-small"/>
                </div>
            </div>
            <p className="post-date">Posted: {formatDisplayDate(comment.created)}</p>
            <div className="description-txt" dangerouslySetInnerHTML={{ __html: sanitizePostHtml(comment.content) }}></div>
        </div>
    </div>
}

interface CommentContainerProps {
    comments: IComment[]
    loadMore: () => void
    isLoading: boolean
    hasMore: boolean
    error?: unknown
    onRetry?: () => void
}

export function CommentContainer({ comments, loadMore, isLoading, hasMore, error, onRetry }: CommentContainerProps) {
    const [sentinel, setSentinel] = useState<HTMLDivElement | null>(null)
    const loadMoreRef = useRef(loadMore)
    const canLoadMore = hasMore && !isLoading && !error

    useEffect(() => {
        loadMoreRef.current = loadMore
    })

    useEffect(() => {
        if (!sentinel || !canLoadMore) return
        const observer = new IntersectionObserver(([entry]) => {
            if (entry?.isIntersecting) loadMoreRef.current()
        })
        observer.observe(sentinel)
        return () => observer.disconnect()
    }, [sentinel, canLoadMore])

    return <>
        {comments.map(comment => <Comment key={commentKey(comment)} comment={comment}/>)}
        {error ?
            <div className="center-element post-page-element-container">
                <p role="alert">Couldn&apos;t load comments.</p>
                {onRetry && <button type="button" className="main-button" onClick={onRetry}>Retry</button>}
            </div>
            : hasMore && <div ref={setSentinel} aria-busy={isLoading}>{isLoading && <Spinner/>}</div>}
    </>
}

interface PostCommentInputProps {
    authorIcon: string
    authorName: string
    createComment: (comment: string) => Promise<boolean>
}

export function PostCommentInput({ authorIcon, authorName, createComment }: PostCommentInputProps) {
    const [commentValue, setCommentValue] = useState("")
    const [isPosting, setIsPosting] = useState(false)

    async function postComment() {
        if (isPosting) return
        setIsPosting(true)
        try {
            if (await createComment(commentValue)) setCommentValue("")
        } finally {
            setIsPosting(false)
        }
    }

    return <div className="center-element post-comment-content post-page-element-container">
        <div className="center-element">
            <Image className="post-author-icon-small" src={authorIcon} alt="" width={32} height={32} />
            <p className="post-author-name">{authorName}</p>
        </div>
        <EditorProvider>
            <Editor className="input comment-input" name="comment" id="comment" aria-label="Write a comment" value={commentValue} onChange={(e) => setCommentValue(e.target.value)}/>
        </EditorProvider>
        <BusyButton busy={isPosting} busyText="Posting..." onClick={postComment}>Post</BusyButton>
    </div>
}
