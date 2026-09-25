import type { MetadataRoute } from "next";
import { siteUrl } from "config/siteMetadata";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: { userAgent: "*", allow: "/", disallow: ["/new-post"] },
        sitemap: `${siteUrl}/sitemap.xml`,
    }
}
