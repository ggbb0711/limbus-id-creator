import { TagKey } from "features/post/utils/TagList"
import { PostAuthor } from "./PostAuthor"

export type PostCardKind = "Identity" | "Ego"

export interface IPostCardSnapshot {
    id: string
    position: number
    kind: PostCardKind
    imageUrl: string
    saveId?: string | null
    saveInfo: unknown
}

export interface IPostSlide {
    imageUrl: string
    card?: IPostCardSnapshot | null
}

export interface IPost extends PostAuthor {
    id: string
    title: string
    imagesAttach: string[]
    description: string
    tags: TagKey[]
    viewCount: number
    commentCount: number
    created: string
    updated?: string | null
    slides?: IPostSlide[]
    hasCards?: boolean
}
