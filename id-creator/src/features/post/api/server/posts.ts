import 'server-only'
import { cache } from 'react'
import { apiGet } from 'api/server/serverFetch'
import { IPost } from 'features/post/types/IPost'

interface IPostList {
    list: IPost[]
    total: number
}

// cache() dedupes within one request, so generateMetadata + page share a single fetch.
// Note: the backend logs a view on GET /Post/{id}; the client still requests the post itself
// (features/post/postPage/PostPage) so views keep being counted per user.
export const getPost = cache((postId: string) =>
    apiGet<IPost>(`/Post/${encodeURIComponent(postId)}`),
)

export const getLatestPosts = cache(async (limit: number): Promise<IPostList | null> => {
    const params = new URLSearchParams({ Title: '', SortedBy: 'Latest', page: '0', limit: String(limit) })
    try {
        return await apiGet<IPostList>(`/Post?${params}`)
    } catch (err) {
        // Lists are prerendered at build time; don't fail the build when the backend is unreachable.
        console.error('getLatestPosts failed', err)
        return null
    }
})
