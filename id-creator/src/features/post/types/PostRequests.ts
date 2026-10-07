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

export interface ICreatePostBody {
    title: string
    description: string
    imagesAttach: string[]
    tags: string[]
}
