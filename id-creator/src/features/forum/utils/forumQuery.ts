import { ITag, PostSortOption, TagList, isPostSortOption } from "features/post"

export interface ForumQueryUpdate {
    q?: string
    tag?: string[]
    sort?: PostSortOption
    page?: number
}

export const parseSort = (value: string | null): PostSortOption => (isPostSortOption(value) ? value : "Latest")

export const tagKeyOf = (tag: ITag | undefined): string | undefined =>
    tag ? Object.keys(TagList).find(key => TagList[key].tagName === tag.tagName) : undefined

export function buildForumQuery(current: URLSearchParams | string, next: ForumQueryUpdate): string {
    const params = new URLSearchParams(current)
    if (next.q !== undefined) {
        if (next.q) params.set("q", next.q)
        else params.delete("q")
    }
    if (next.tag !== undefined) {
        params.delete("tag")
        next.tag.forEach(key => params.append("tag", key))
    }
    if (next.sort !== undefined) {
        if (next.sort === "Latest") params.delete("sort")
        else params.set("sort", next.sort)
    }
    const page = next.page ?? 0
    if (page > 0) params.set("page", String(page))
    else params.delete("page")
    return params.toString()
}
