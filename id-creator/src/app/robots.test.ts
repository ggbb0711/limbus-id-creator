import { siteUrl } from 'config/siteMetadata'
import robots from './robots'

const blockedBots = ['Bytespider', 'PetalBot', 'MJ12bot', 'GPTBot', 'CCBot', 'ClaudeBot', 'Google-Extended', 'Applebot-Extended']

describe('robots', () => {
    const result = robots()
    const rules = Array.isArray(result.rules) ? result.rules : [result.rules]

    it('lets every crawler index the site except query-string listings and new-post', () => {
        expect(rules).toContainEqual({ userAgent: '*', allow: '/', disallow: ['/new-post', '/forum?', '/blog?'] })
    })

    it('blocks aggressive scrapers and AI training bots from the whole site', () => {
        expect(rules).toContainEqual({ userAgent: blockedBots, disallow: '/' })
    })

    it('does not block search engines', () => {
        const blocked = rules.flatMap(rule => rule.disallow === '/' ? [rule.userAgent].flat() : [])
        expect(blocked).not.toEqual(expect.arrayContaining(['Googlebot']))
        expect(blocked).not.toEqual(expect.arrayContaining(['Bingbot']))
    })

    it('points to the sitemap', () => {
        expect(result.sitemap).toBe(`${siteUrl}/sitemap.xml`)
    })
})
