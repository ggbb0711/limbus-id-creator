'use client'
import { appConfig } from "config/env.client"
import { useApiErrorAlert } from "hooks/useApiErrorAlert"
import { useGetPostsQuery } from "features/post/api/PostApi"
import { buildPostsQuery } from "features/post/api/buildPostsQuery"
import { GetPostsFilter } from "features/post/types/PostRequests"
import { IPostList } from "features/post/types/IPostList"

export interface InitialPostPage {
    query: string
    data: IPostList
}

export function usePaginatedPosts(page: number, filter: GetPostsFilter = {}, initial?: InitialPostPage) {
    const pageSize = appConfig.paging.postsPerPage
    const params = { ...filter, page, limit: pageSize }
    const { currentData, error, isFetching, refetch } = useGetPostsQuery(params)
    const data = currentData ?? (initial && initial.query === buildPostsQuery(params) ? initial.data : undefined)

    useApiErrorAlert(error)

    return {
        postList: data?.list ?? [],
        maxCount: data?.total ?? 0,
        pageSize,
        isLoading: !data && isFetching,
        error: data ? undefined : error,
        refetch,
    }
}
