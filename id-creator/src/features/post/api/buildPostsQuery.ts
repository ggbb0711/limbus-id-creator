import { GetPostsParams } from "features/post/types/PostRequests"

export function buildPostsQuery({ title = "", tag = [], sortedBy = "Latest", page, limit, userId, excludeIds = [] }: GetPostsParams): string {
    const params = new URLSearchParams({
        Title: title,
        SortedBy: sortedBy,
        page: String(page),
        limit: String(limit),
    })
    tag.forEach(t => params.append("Tag", t))
    if (userId) params.append("UserId", userId)
    excludeIds.forEach(id => params.append("ExcludeIds", id))
    return params.toString()
}
