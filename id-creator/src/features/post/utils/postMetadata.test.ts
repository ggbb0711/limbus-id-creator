import { siteUrl } from 'config/siteMetadata'
import { IPost } from 'features/post/types/IPost'
import { absolutePostUrl, postDescription, postMetadata } from './postMetadata'

const post: IPost = {
    id: 'a b', title: 'Faust', imagesAttach: ['https://x/a.png'], description: '<p>Hello <b>world</b></p>',
    userIcon: '', userName: 'Meph', userId: 'u1', tags: ['Faust', 'Bleed'], viewCount: 1, commentCount: 0, created: '2026-10-01T09:30:00',
}

describe('postMetadata', () => {
    it('describes the post as an article for link previews', () => {
        const meta = postMetadata(post)
        expect(meta.alternates).toEqual({ canonical: '/post/a%20b' })
        expect(meta.openGraph).toMatchObject({
            type: 'article',
            title: 'Faust',
            description: 'Hello world',
            url: '/post/a%20b',
            siteName: 'Limbus ID Creator',
            publishedTime: '2026-10-01T09:30:00.000Z',
            authors: [`${siteUrl}/user/u1`],
            tags: ['Faust', 'Bleed'],
        })
        expect(meta.twitter).toMatchObject({ card: 'summary_large_image', title: 'Faust' })
    })

    it('leaves images to the generated preview card', () => {
        const meta = postMetadata(post)
        expect(meta.openGraph).not.toHaveProperty('images')
        expect(meta.twitter).not.toHaveProperty('images')
    })

    it('falls back to a generic description', () => {
        expect(postDescription({ description: '<p> </p>', userName: 'Meph' })).toBe('A custom Limbus Company creation by Meph')
    })
})

describe('absolutePostUrl', () => {
    it('builds the encoded absolute post url from the site url', () => {
        expect(absolutePostUrl('a b/c')).toBe(`${siteUrl}/post/a%20b%2Fc`)
    })
})
