import 'server-only'
import { cache } from 'react'
import { apiGet } from 'api/server/serverFetch'
import { IComment } from 'features/post/types/IComment'
import { reportError } from 'utils/reportError'

export const getFirstComments = cache(async (postId: string, limit: number): Promise<IComment[]> => {
    try {
        return await apiGet<IComment[]>(`/Comment/post/${encodeURIComponent(postId)}?page=0&limit=${limit}`) ?? []
    } catch (error) {
        reportError(error, { context: 'getFirstComments', extra: { postId } })
        return []
    }
})
