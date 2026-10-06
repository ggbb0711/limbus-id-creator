'use client'
import { useEffect } from "react"
import { appConfig } from "config/env.client"
import getApiErrorMessage from "api/getApiErrorMessage"
import { useAddAlert } from "hooks/useAddAlert"
import { useGetPostsQuery } from "features/post/api/PostApi"
import { GetPostsFilter, buildPostsQuery } from "features/post/api/buildPostsQuery"
import { IPostDisplayCard } from "features/post/types/IPostDisplayCard"

export interface PostPage {
    list: IPostDisplayCard[]
    total: number
}

export interface InitialPostPage {
    query: string
    data: PostPage
}

export function usePaginatedPosts(page: number, filter: GetPostsFilter = {}, initial?: InitialPostPage) {
    const addAlert = useAddAlert()
    const pageSize = appConfig.paging.postsPerPage
    const params = { ...filter, page, limit: pageSize }
    const { currentData, error, isFetching, refetch } = useGetPostsQuery(params)
    const data = currentData ?? (initial && initial.query === buildPostsQuery(params) ? initial.data : undefined)

    useEffect(() => {
        if (error) addAlert("Failure", getApiErrorMessage(error))
    }, [error, addAlert])

    return {
        postList: data?.list ?? [],
        maxCount: data?.total ?? 0,
        pageSize,
        isLoading: !data && isFetching,
        error: data ? undefined : error,
        refetch,
    }
}
