import type { MetadataRoute } from "next";
import { siteUrl } from "config/siteMetadata";

const blockedBots = ["Bytespider", "PetalBot", "MJ12bot", "GPTBot", "CCBot", "ClaudeBot", "Google-Extended", "Applebot-Extended"]

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            { userAgent: "*", allow: "/", disallow: ["/new-post", "/forum?", "/blog?"] },
            { userAgent: blockedBots, disallow: "/" },
        ],
        sitemap: `${siteUrl}/sitemap.xml`,
    }
}
