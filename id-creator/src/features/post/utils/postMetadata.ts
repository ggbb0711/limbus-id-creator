import type { Metadata } from "next"
import { baseOpenGraph, siteUrl } from "config/siteMetadata"
import { IPost } from "features/post/types/IPost"
import { getTag } from "features/post/utils/TagList"
import { parseServerDate } from "utils/formatDisplayDate"
import stripHtml from "utils/stripHtml"

export const postPath = (postId: string) => `/post/${encodeURIComponent(postId)}`

export const absolutePostUrl = (postId: string) => `${siteUrl}${postPath(postId)}`

export function postDescription(post: Pick<IPost, "description" | "userName">): string {
    return stripHtml(post.description).replace(/\s+/g, " ").trim().slice(0, 160) || `A custom Limbus Company creation by ${post.userName}`
}

export function postMetadata(post: IPost): Metadata {
    const path = postPath(post.id)
    const description = postDescription(post)
    const authorUrl = `${siteUrl}/user/${encodeURIComponent(post.userId)}`
    return {
        title: post.title,
        description,
        alternates: { canonical: path },
        authors: [{ name: post.userName, url: authorUrl }],
        openGraph: {
            ...baseOpenGraph,
            type: "article",
            title: post.title,
            description,
            url: path,
            publishedTime: parseServerDate(post.created)?.toISOString(),
            authors: [authorUrl],
            tags: post.tags.map(tag => getTag(tag)?.tagName ?? tag),
        },
        twitter: { card: "summary_large_image", title: post.title, description },
    }
}
