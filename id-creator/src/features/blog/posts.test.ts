import fs from 'fs'
import path from 'path'
import { getAllPosts, getHeadings, getPost } from './posts'
import { BlogTag, blogPostTags } from './blogTags'
import { baseStatusEffect } from 'features/cardCreator/utils/keywords/BaseStatusEffect'
import { SITE_LINKS } from 'config/siteLinks'

jest.mock('server-only', () => ({}))

const postsDir = path.join(process.cwd(), 'src/content/blog')
const slugs = fs.readdirSync(postsDir).filter(file => file.endsWith('.md')).map(file => file.replace(/\.md$/, ''))
const wordCount = (text: string) => text.split(/\s+/).filter(Boolean).length

describe('blog posts', () => {
    it('lists every markdown file', () => {
        expect(getAllPosts().map(post => post.slug).sort()).toEqual([...slugs].sort())
    })

    it.each(slugs)('%s has front matter and a registered tag', slug => {
        const post = getPost(slug)!
        expect(post.title).not.toBe(slug)
        expect(post.description.length).toBeGreaterThan(0)
        expect(post.published).toMatch(/^\d{4}-\d{2}-\d{2}$/)
        expect(blogPostTags[slug]?.length).toBeGreaterThan(0)
    })

    it.each(slugs.filter(slug => blogPostTags[slug]?.includes(BlogTag.Guide)))('guide %s has at least 1,200 words', slug => {
        expect(wordCount(getPost(slug)!.content)).toBeGreaterThanOrEqual(1200)
    })

    it.each(slugs)('%s has no emoji', slug => {
        expect(getPost(slug)!.content).not.toMatch(/\p{Extended_Pictographic}/u)
    })

    it.each(slugs)('%s has unique heading ids', slug => {
        const ids = getHeadings(getPost(slug)!.content).map(heading => heading.id)
        expect(new Set(ids).size).toBe(ids.length)
    })

    it.each(slugs)('%s only links to headings that exist on the target guide', slug => {
        const links = [...getPost(slug)!.content.matchAll(/\]\((\/blog\/([a-z0-9-]+))?#([a-z0-9-]+)\)/g)]
        links.forEach(([, , target, anchor]) => {
            const targetPost = getPost(target ?? slug)
            expect(targetPost).toBeDefined()
            expect(getHeadings(targetPost!.content).map(heading => heading.id)).toContain(anchor)
        })
    })
})

describe('keywords-and-status-effects reference', () => {
    const content = getPost('keywords-and-status-effects')!.content
    const reference = content.slice(content.indexOf('## Keyword reference'))
    const listed = [...reference.matchAll(/^\| `\[(.+)\]` \|/gm)].map(match => match[1])

    it('lists only keywords the editor knows', () => {
        expect(listed.length).toBeGreaterThan(500)
        expect(listed.filter(key => !Object.hasOwn(baseStatusEffect, key))).toEqual([])
    })

    it('tells readers how to suggest a missing status effect with the current contact details', () => {
        expect(getHeadings(content).map(heading => heading.text)).toContain('Suggest a status effect')
        expect(content).toContain(`mailto:${SITE_LINKS.contactEmail}`)
        expect(content).toContain(SITE_LINKS.discordHandle)
    })

    it('lists every non-coin keyword once', () => {
        expect(new Set(listed).size).toBe(listed.length)
        const nonCoin = new Set(Object.keys(baseStatusEffect).filter(key => !key.startsWith('coin_')).map(key => baseStatusEffect[key]))
        const listedHtml = new Set(listed.map(key => baseStatusEffect[key]))
        expect([...nonCoin].filter(html => !listedHtml.has(html))).toEqual([])
    })
})
