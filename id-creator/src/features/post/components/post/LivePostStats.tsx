'use client'
import React, { ReactElement } from "react";
import { useAuth } from "hooks/useAuth";
import { useGetPostQuery } from "features/post/api/PostApi";
import PostStats from "features/post/components/postStats/PostStats";

interface LivePostStatsProps {
    postId: string
    viewCount: number
    commentCount: number
}

export default function LivePostStats({ postId, viewCount, commentCount }: LivePostStatsProps): ReactElement {
    const { isInitializing } = useAuth()
    const { data } = useGetPostQuery(postId, { skip: isInitializing })
    return <PostStats viewCount={data?.viewCount ?? viewCount} commentCount={data?.commentCount ?? commentCount} itemClassName="card-tag center-element" iconSize={16}/>
}
