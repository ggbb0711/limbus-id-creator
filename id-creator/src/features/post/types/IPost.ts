import { TagKey } from "features/post/utils/TagList"
import { PostAuthor } from "./PostAuthor"

export interface IPost extends PostAuthor {
    id: string
    title: string
    imagesAttach: string[]
    description: string
    tags: TagKey[]
    viewCount: number
    commentCount: number
    created: string
}
