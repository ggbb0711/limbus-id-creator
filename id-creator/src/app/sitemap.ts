import type { MetadataRoute } from "next";
import { siteUrl } from "config/siteMetadata";
import { getLatestPosts } from "api/server/posts";

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
    const posts = (await getLatestPosts(100))?.list ?? []
    return [
        ...staticRoutes.map(({ path, changeFrequency, priority }) => ({ url: `${siteUrl}${path}`, changeFrequency, priority })),
        ...posts.map((post) => ({ url: `${siteUrl}/post/${post.id}`, changeFrequency: "weekly" as const, priority: 0.6 })),
    ]
}
