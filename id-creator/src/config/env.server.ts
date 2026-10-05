import 'server-only'
import { readInt } from './readEnv'

function required(name: string): string {
    const value = process.env[name]
    if (!value) throw new Error(`Missing environment variable ${name}`)
    return value
}

// Server-only values. Importing this from a client component fails the build.
export const serverEnv = {
    get apiUrl() { return required("API_URL") },
}

export const serverConfig = Object.freeze({
    apiRevalidateSeconds: readInt(process.env.API_REVALIDATE_SECONDS, "API_REVALIDATE_SECONDS", 60, { min: 0 }),
    apiTimeoutMs: readInt(process.env.API_TIMEOUT_MS, "API_TIMEOUT_MS", 10_000, { min: 1000 }),
    homeLatestPosts: readInt(process.env.HOME_LATEST_POSTS, "HOME_LATEST_POSTS", 4, { min: 1, max: 50 }),
    sitemapPostCount: readInt(process.env.SITEMAP_POST_COUNT, "SITEMAP_POST_COUNT", 100, { min: 1, max: 5000 }),
})
