'use client'
import { useEffect, useRef } from "react"
import { appConfig } from "config/env.client"
import getApiErrorMessage from "api/getApiErrorMessage"
import useAlert from "hooks/useAlert"
import { GetPostsFilter, useGetPostsQuery } from "features/post/api/PostApi"

export function usePaginatedPosts(page: number, filter: GetPostsFilter = {}) {
    const { addAlert } = useAlert()
    const addAlertRef = useRef(addAlert)
    const pageSize = appConfig.paging.postsPerPage
    const { data, error, isLoading, isFetching } = useGetPostsQuery({ ...filter, page, limit: pageSize })

    useEffect(() => {
        addAlertRef.current = addAlert
    })

    useEffect(() => {
        if (error) addAlertRef.current("Failure", getApiErrorMessage(error))
    }, [error])

    return {
        postList: data?.list ?? [],
        maxCount: data?.total ?? 0,
        pageSize,
        isLoading,
        isFetching,
    }
}
