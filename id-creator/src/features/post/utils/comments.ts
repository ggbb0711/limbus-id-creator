import { IComment, ICommentPage } from "features/post/types/IComment"

const WALL_CLOCK = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/

export const toWallClock = (created: string): string => WALL_CLOCK.exec(created)?.[0] ?? created

export const commentKey = (comment: IComment): string =>
    `${comment.userId}|${toWallClock(comment.created)}|${comment.content}`

export const hasMoreComments = (pageLength: number, limit: number): boolean => limit > 0 && pageLength >= limit

export function toCommentPage(list: IComment[], limit: number): ICommentPage {
    return { list, hasMore: hasMoreComments(list.length, limit) }
}

export function mergeCommentPage(current: ICommentPage, incoming: ICommentPage, page: number): ICommentPage {
    if (page === 0) return incoming
    const seen = new Set(current.list.map(commentKey))
    return {
        list: [...current.list, ...incoming.list.filter(comment => !seen.has(commentKey(comment)))],
        hasMore: incoming.hasMore,
    }
}

export function appendCreatedComment(current: ICommentPage, comment: IComment): ICommentPage {
    if (current.hasMore) return current
    const key = commentKey(comment)
    if (current.list.some(existing => commentKey(existing) === key)) return current
    return { ...current, list: [...current.list, comment] }
}
