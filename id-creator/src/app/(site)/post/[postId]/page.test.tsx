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

import Page, { generateMetadata, generateStaticParams, revalidate } from './page'

const params = (postId: string) => ({ params: Promise.resolve({ postId }) }) as never

describe('post page', () => {
    beforeEach(() => jest.mocked(getPost).mockReset())

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
})
