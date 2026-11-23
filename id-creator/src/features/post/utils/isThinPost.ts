import { IPost } from "features/post/types/IPost"
import { stripHtml } from "utils/htmlUtils"

export const THIN_POST_MAX_WORDS = 50

export function isThinPost(post: Pick<IPost, "description" | "slides" | "hasCards">): boolean {
    if (post.hasCards || (post.slides ?? []).some(slide => slide.card)) return false
    return stripHtml(post.description ?? "").split(/\s+/).filter(Boolean).length < THIN_POST_MAX_WORDS
}
