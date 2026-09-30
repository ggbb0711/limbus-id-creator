import 'server-only'
import { cache } from 'react'
import { apiGet } from './serverFetch'
import { IComment } from 'types/iPost/IComment'

export const getFirstComments = cache(async (postId: string, limit: number): Promise<IComment[]> => {
    try {
        return await apiGet<IComment[]>(`/Comment/post/${encodeURIComponent(postId)}?page=0&limit=${limit}`) ?? []
    } catch (err) {
        console.error('getFirstComments failed', err)
        return []
    }
})
