import EditPostPage from 'features/post/editPostPage/EditPostPage'

jest.mock('features/post/editPostPage/EditPostPage', () => () => null)

import Page, { metadata } from './page'

describe('edit post page', () => {
    it('renders the edit page for the post id', async () => {
        const element = await Page({ params: Promise.resolve({ postId: 'p1' }) } as never)
        expect(element.type).toBe(EditPostPage)
        expect(element.props).toEqual({ postId: 'p1' })
    })

    it('stays out of search results', () => {
        expect(metadata).toEqual({ title: 'Edit post', robots: { index: false } })
    })
})
