'use client'
import React, { ReactElement } from "react";
import { useAuth } from "hooks/useAuth";
import { useGetPostQuery } from "features/post/api/PostApi";
import { IPost } from "features/post/types/IPost";
import PostStats from "features/post/components/postStats/PostStats";

export default function LivePostStats({ initialPost }: { initialPost: IPost }): ReactElement {
    const { isInitializing } = useAuth()
    const { data: post = initialPost } = useGetPostQuery(initialPost.id, { skip: isInitializing })
    return <PostStats viewCount={post.viewCount} commentCount={post.commentCount} itemClassName="card-tag center-element" iconSize={16}/>
}
