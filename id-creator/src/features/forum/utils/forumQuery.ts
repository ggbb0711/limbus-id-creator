import { PostSortOption, TagKey, isPostSortOption, isTagKey } from "features/post"

import { parsePage } from "utils/parsePage"

export { tagKeyOf } from "features/post"
export { parsePage }

export interface ForumQueryUpdate {
    q?: string
    tag?: string[]
    sort?: PostSortOption
    page?: number
}

export interface ForumParams {
    q: string
    tagKeys: TagKey[]
    sort: PostSortOption
    page: number
}

type ParamSource = { get(name: string): string | null, getAll(name: string): string[] }

export const parseSort = (value: string | null): PostSortOption => (isPostSortOption(value) ? value : "Latest")

export function parseForumParams(params: ParamSource): ForumParams {
    return {
        q: params.get("q") ?? "",
        tagKeys: [...new Set(params.getAll("tag").filter(isTagKey))],
        sort: parseSort(params.get("sort")),
        page: parsePage(params.get("page")),
    }
}

export function toSearchParams(record: Record<string, string | string[] | undefined>): URLSearchParams {
    const params = new URLSearchParams()
    Object.entries(record).forEach(([key, value]) => {
        if (Array.isArray(value)) value.forEach(v => params.append(key, v))
        else if (value !== undefined) params.set(key, value)
    })
    return params
}

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
