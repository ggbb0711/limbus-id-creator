import 'server-only'
import { cache } from 'react'
import { apiGet } from 'api/server/serverFetch'
import { IPost } from 'features/post/types/IPost'
import { IPostList } from 'features/post/types/IPostList'
import { toPostDisplayCard } from 'features/post/utils/toPostDisplayCard'
import { buildPostsQuery } from 'features/post/api/buildPostsQuery'
import { GetPostsParams } from 'features/post/types/PostRequests'
import { Result, fail, ok } from 'utils/result'
import { reportError } from 'utils/reportError'


// cache() dedupes within one request, so generateMetadata + page share a single fetch.
// Note: the backend logs a view on GET /Post/{id}; the client still requests the post itself
// (features/post/postPage/PostPage) so views keep being counted per user.
export const getPost = cache((postId: string) =>
    apiGet<IPost>(`/Post/${encodeURIComponent(postId)}`),
)

const fetchPostPage = cache(async (query: string): Promise<Result<IPostList>> => {
    try {
        const data = await apiGet<IPostList<IPost>>(`/Post?${query}`)
        return ok({ list: (data?.list ?? []).map(toPostDisplayCard), total: data?.total ?? 0 })
    } catch (error) {
        reportError(error, { context: 'getPosts', extra: { query } })
        return fail(error)
    }
})

export const getPosts = (params: GetPostsParams) => fetchPostPage(buildPostsQuery(params))

export const getLatestPosts = (limit: number) => getPosts({ page: 0, limit, sortedBy: 'Latest' })

export const getPostsByUser = (userId: string, limit: number, excludeIds: string[] = []) =>
    getPosts({ page: 0, limit, sortedBy: 'Latest', userId, excludeIds })

export const getLatestPostsExcluding = (limit: number, excludeIds: string[]) =>
    getPosts({ page: 0, limit, sortedBy: 'Latest', excludeIds })
