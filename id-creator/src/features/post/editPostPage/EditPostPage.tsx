'use client'
import React, { ReactElement, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "hooks/useAuth";
import { useGetPostQuery } from "features/post/api/PostApi";
import getApiErrorMessage from "api/getApiErrorMessage";
import Spinner from "components/ui/spinner/Spinner";
import NewPostPage from "features/post/newPostPage/NewPostPage";

export default function EditPostPage({ postId }: { postId: string }): ReactElement {
    const router = useRouter()
    const { user, isInitializing } = useAuth()
    const { data: post, error, isLoading } = useGetPostQuery(postId, { refetchOnMountOrArgChange: true })
    const isAuthor = !!user && !!post && user.id === post.userId
    const isForbidden = !isInitializing && !!post && !isAuthor

    useEffect(() => {
        if (isForbidden) router.replace(`/post/${encodeURIComponent(postId)}`)
    }, [isForbidden, postId, router])

    if (error) return <div className="page-container post-page">
        <div className="page-content" role="alert">{getApiErrorMessage(error)}</div>
    </div>

    if (isLoading || isInitializing || !post || !isAuthor) return <div className="page-container post-page">
        <div className="page-content center-element-vertically"><Spinner/></div>
    </div>

    return <NewPostPage post={post}/>
}
