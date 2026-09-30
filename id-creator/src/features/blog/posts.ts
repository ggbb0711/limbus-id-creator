import 'server-only'
import fs from 'fs'
import path from 'path'
import { cache } from 'react'
import matter from 'gray-matter'
import GithubSlugger from 'github-slugger'
import { BlogTag, blogPostTags } from './blogTags'

const postsDir = path.join(process.cwd(), 'src/content/blog')
const slugPattern = /^[a-z0-9-]+$/

export interface IBlogPostMeta {
    slug: string
    title: string
    description: string
    published: string
    tags: BlogTag[]
}

export interface IBlogPost extends IBlogPostMeta {
    content: string
}

export interface IBlogHeading {
    depth: 2 | 3
    text: string
    id: string
}

function readPost(slug: string): IBlogPost | undefined {
    if (!slugPattern.test(slug)) return undefined
    const file = path.join(postsDir, `${slug}.md`)
    if (!fs.existsSync(file)) return undefined

    const { data, content } = matter(fs.readFileSync(file, 'utf8'))
    const published = data.published instanceof Date ? data.published.toISOString().slice(0, 10) : String(data.published ?? '')
    return {
        slug,
        title: String(data.title ?? slug),
        description: String(data.description ?? ''),
        published,
        tags: blogPostTags[slug] ?? [],
        content,
    }
}

export const getPost = cache((slug: string) => readPost(slug))

export const getAllPosts = cache((): IBlogPostMeta[] =>
    fs.readdirSync(postsDir)
        .filter((file) => file.endsWith('.md'))
        .map((file) => readPost(file.replace(/\.md$/, '')))
        .filter((post): post is IBlogPost => !!post)
        .map(({ slug, title, description, published, tags }) => ({ slug, title, description, published, tags }))
        .sort((a, b) => b.published.localeCompare(a.published) || a.title.localeCompare(b.title)),
)

export function getAllTags(): BlogTag[] {
    return Object.values(BlogTag)
}

function headingText(markdown: string): string {
    return markdown
        .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
        .replace(/`([^`]*)`/g, '$1')
        .replace(/(\*\*|__|\*|_)(.+?)\1/g, '$2')
        .trim()
}

export function getHeadings(content: string): IBlogHeading[] {
    const slugger = new GithubSlugger()
    const headings: IBlogHeading[] = []
    let inFence = false
    for (const line of content.split('\n')) {
        if (/^\s*(```|~~~)/.test(line)) inFence = !inFence
        if (inFence) continue
        const match = /^(#{1,6})\s+(.+?)\s*#*\s*$/.exec(line)
        if (!match) continue
        const text = headingText(match[2])
        const id = slugger.slug(text)
        const depth = match[1].length
        if (depth === 2 || depth === 3) headings.push({ depth, text, id })
    }
    return headings
}
