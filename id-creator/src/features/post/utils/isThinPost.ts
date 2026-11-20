import { IPost } from "features/post/types/IPost"
import { stripHtml } from "utils/htmlUtils"

export const THIN_POST_MAX_WORDS = 50

export function isThinPost(post: Pick<IPost, "description" | "cards" | "hasCards">): boolean {
    if (post.hasCards || (post.cards?.length ?? 0) > 0) return false
    return stripHtml(post.description ?? "").split(/\s+/).filter(Boolean).length < THIN_POST_MAX_WORDS
}
