import { notFound } from 'next/navigation'
import { getPost } from 'features/post/api/server/posts'

jest.mock('server-only', () => ({}))
jest.mock('next/navigation', () => ({ notFound: jest.fn(() => { throw new Error('NEXT_NOT_FOUND') }) }))
jest.mock('features/post/api/server/posts', () => ({
    getPost: jest.fn(),
    getPostsByUser: jest.fn(),
    getLatestPostsExcluding: jest.fn(),
}))
jest.mock('features/post/api/server/comments', () => ({ getFirstComments: jest.fn() }))
jest.mock('features/post/postPage/PostPage', () => () => null)
jest.mock('features/post/components/postSidebar/PostSidebar', () => () => null)

import UnavailablePage from 'components/unavailablePage/UnavailablePage'
import Page, { generateMetadata, generateStaticParams, revalidate } from './page'

const params = (postId: string) => ({ params: Promise.resolve({ postId }) }) as never

describe('post page', () => {
    beforeEach(() => {
        jest.mocked(getPost).mockReset()
        jest.mocked(notFound).mockClear()
    })

    it('is rendered on demand and cached', () => {
        expect(generateStaticParams()).toEqual([])
        expect(revalidate).toBe(60)
    })

    it('calls notFound for a missing post', async () => {
        jest.mocked(getPost).mockResolvedValue(null)
        await expect(Page(params('missing'))).rejects.toThrow('NEXT_NOT_FOUND')
        expect(notFound).toHaveBeenCalled()
    })

    it('titles a missing post as not found', async () => {
        jest.mocked(getPost).mockResolvedValue(null)
        await expect(generateMetadata(params('missing'))).resolves.toEqual({ title: 'Post not found' })
    })

    it('renders the unavailable page for POST_REMOVED', async () => {
        jest.mocked(getPost).mockResolvedValue({ unavailable: true, code: 'POST_REMOVED' })
        const element = await Page(params('gone'))
        expect(element.type).toBe(UnavailablePage)
        expect(element.props).toEqual({ code: 'POST_REMOVED' })
        expect(notFound).not.toHaveBeenCalled()
    })

    it('titles POST_REMOVED as Post removed and keeps it out of search', async () => {
        jest.mocked(getPost).mockResolvedValue({ unavailable: true, code: 'POST_REMOVED' })
        await expect(generateMetadata(params('gone'))).resolves.toEqual({ title: 'Post removed', robots: { index: false } })
    })

    it('renders the unavailable page for POST_AUTHOR_BANNED', async () => {
        jest.mocked(getPost).mockResolvedValue({ unavailable: true, code: 'POST_AUTHOR_BANNED' })
        const element = await Page(params('gone'))
        expect(element.type).toBe(UnavailablePage)
        expect(element.props).toEqual({ code: 'POST_AUTHOR_BANNED' })
        expect(notFound).not.toHaveBeenCalled()
    })

    it('titles POST_AUTHOR_BANNED as Post unavailable and keeps it out of search', async () => {
        jest.mocked(getPost).mockResolvedValue({ unavailable: true, code: 'POST_AUTHOR_BANNED' })
        await expect(generateMetadata(params('gone'))).resolves.toEqual({ title: 'Post unavailable', robots: { index: false } })
    })
})
