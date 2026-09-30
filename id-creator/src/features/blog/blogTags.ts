export enum BlogTag {
    Guide = "Guide",
}

export const blogPostTags: Record<string, BlogTag[]> = {
    "card-creator-guide": [BlogTag.Guide],
    "how-to-post-your-creation": [BlogTag.Guide],
}

export function isBlogTag(value: unknown): value is BlogTag {
    return Object.values(BlogTag).includes(value as BlogTag)
}
