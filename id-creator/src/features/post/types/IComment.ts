import { PostAuthor } from "./PostAuthor"

export interface IComment extends PostAuthor {
    postId: string
    content: string
    created: string
}

export interface ICommentPage {
    list: IComment[]
    hasMore: boolean
}

export interface IGetCommentsParams {
    postId: string
    page: number
    limit: number
}

export interface ICreateCommentBody {
    postId: string
    content: string
}
