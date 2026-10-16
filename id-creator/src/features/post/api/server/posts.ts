import 'server-only'
import { cache } from 'react'
import { apiGet, apiGetOrUnavailable } from 'api/server/serverFetch'
import { IPost } from 'features/post/types/IPost'
import { IPostList } from 'features/post/types/IPostList'
import { toPostDisplayCard } from 'features/post/utils/toPostDisplayCard'
import { buildPostsQuery } from 'features/post/api/buildPostsQuery'
import { GetPostsParams } from 'features/post/types/PostRequests'
import { Result, fail, ok } from 'utils/result'
import { reportError } from 'utils/reportError'
import { serverConfig } from 'config/env.server'


export const getPost = cache((postId: string) =>
    apiGetOrUnavailable<IPost>(`/Post/${encodeURIComponent(postId)}`),
)

const fetchPostPage = cache(async (query: string, revalidate: number): Promise<Result<IPostList>> => {
    try {
        const data = await apiGet<IPostList<IPost>>(`/Post?${query}`, { revalidate })
        return ok({ list: (data?.list ?? []).map(toPostDisplayCard), total: data?.total ?? 0 })
    } catch (error) {
        reportError(error, { context: 'getPosts', extra: { query } })
        return fail(error)
    }
})

export const getPosts = (params: GetPostsParams, revalidate = serverConfig.listRevalidateSeconds) =>
    fetchPostPage(buildPostsQuery(params), revalidate)

export const getLatestPosts = (limit: number, revalidate?: number) =>
    getPosts({ page: 0, limit, sortedBy: 'Latest' }, revalidate)

export const getPostsByUser = (userId: string, limit: number, excludeIds: string[] = [], revalidate?: number) =>
    getPosts({ page: 0, limit, sortedBy: 'Latest', userId, excludeIds }, revalidate)

export const getLatestPostsExcluding = (limit: number, excludeIds: string[], revalidate?: number) =>
    getPosts({ page: 0, limit, sortedBy: 'Latest', excludeIds }, revalidate)
