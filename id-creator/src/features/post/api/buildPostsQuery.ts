import { PostSortOption } from "features/post/types/PostSortOptions"

export interface GetPostsFilter {
    title?: string
    tag?: string[]
    sortedBy?: PostSortOption
    userId?: string
}

export interface GetPostsParams extends GetPostsFilter {
    page: number
    limit: number
}

export function buildPostsQuery({ title = "", tag = [], sortedBy = "Latest", page, limit, userId }: GetPostsParams): string {
    const params = new URLSearchParams({
        Title: title,
        SortedBy: sortedBy,
        page: String(page),
        limit: String(limit),
    })
    tag.forEach(t => params.append("Tag", t))
    if (userId) params.append("UserId", userId)
    return params.toString()
}
