import { PostSortOption } from "./PostSortOptions"

export interface GetPostsFilter {
    title?: string
    tag?: string[]
    sortedBy?: PostSortOption
    userId?: string
    excludeIds?: string[]
}

export interface GetPostsParams extends GetPostsFilter {
    page: number
    limit: number
}

export type PostCardUpdate = { cardId: string } | { saveId: string, kind: "Identity" | "Ego" }

export interface IUpdatePostBody {
    description: string
    cards: PostCardUpdate[]
    tags: string[]
}

export interface ICreatePostBody {
    title: string
    description: string
    cards: { saveId: string, kind: "Identity" | "Ego" }[]
    tags: string[]
}
