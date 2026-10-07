import type { MetadataRoute } from "next";
import { siteUrl } from "config/siteMetadata";
import { getLatestPosts } from "features/post/api/server/posts";
import { getAllPosts } from "features/blog/posts";
import { serverConfig } from "config/env.server";
import { parseServerDate } from "utils/formatDisplayDate";

export const revalidate = 3600

const staticRoutes: { path: string, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"], priority: number }[] = [
    { path: "/", changeFrequency: "weekly", priority: 1.0 },
    { path: "/creator/identity", changeFrequency: "monthly", priority: 0.9 },
    { path: "/creator/ego", changeFrequency: "monthly", priority: 0.9 },
    { path: "/forum", changeFrequency: "daily", priority: 0.8 },
    { path: "/about", changeFrequency: "monthly", priority: 0.5 },
    { path: "/blog", changeFrequency: "weekly", priority: 0.5 },
    { path: "/contact", changeFrequency: "monthly", priority: 0.4 },
    { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.3 },
    { path: "/terms-of-service", changeFrequency: "yearly", priority: 0.3 },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const result = await getLatestPosts(serverConfig.sitemapPostCount)
    const posts = result.ok ? result.data.list : []
    return [
        ...staticRoutes.map(({ path, changeFrequency, priority }) => ({ url: `${siteUrl}${path}`, changeFrequency, priority })),
        ...getAllPosts().map((article) => ({ url: `${siteUrl}/blog/${article.slug}`, lastModified: article.published, changeFrequency: "monthly" as const, priority: 0.7 })),
        ...posts.map((post) => ({
            url: `${siteUrl}/post/${post.id}`,
            lastModified: parseServerDate(post.created) ?? undefined,
            changeFrequency: "weekly" as const,
            priority: 0.6,
        })),
    ]
}
