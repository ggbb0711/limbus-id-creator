'use client'
import { useEffect } from "react"
import { appConfig } from "config/env.client"
import getApiErrorMessage from "api/getApiErrorMessage"
import { useAddAlert } from "hooks/useAddAlert";
import { GetPostsFilter, useGetPostsQuery } from "features/post/api/PostApi"

export function usePaginatedPosts(page: number, filter: GetPostsFilter = {}) {
    const addAlert = useAddAlert()
    const pageSize = appConfig.paging.postsPerPage
    const { data, error, isLoading, isFetching } = useGetPostsQuery({ ...filter, page, limit: pageSize })

    useEffect(() => {
        if (error) addAlert("Failure", getApiErrorMessage(error))
    }, [error, addAlert])

    return {
        postList: data?.list ?? [],
        maxCount: data?.total ?? 0,
        pageSize,
        isLoading,
        isFetching,
    }
}
