import React from 'react'
import { render, screen } from '@testing-library/react'
import { BlogTag } from 'features/blog/blogTags'

jest.mock('server-only', () => ({}))
jest.mock('features/blog/posts', () => ({
    getAllPosts: () => [
        { slug: 'a', title: 'Guide post', description: '', published: '2026-01-01', tags: ['Guide'] },
        { slug: 'b', title: 'News post', description: '', published: '2026-01-02', tags: [] },
    ],
    getAllTags: () => ['Guide'],
}))
const mockFilteredBlogPage = jest.fn()
jest.mock('features/blog/FilteredBlogPage', () => (props: object) => mockFilteredBlogPage(props))

import Page from './page'

describe('blog page', () => {
    beforeEach(() => mockFilteredBlogPage.mockReset())

    it('does not depend on request search params', () => {
        expect(Page.length).toBe(0)
    })

    it('passes every post and tag to the client filter', () => {
        mockFilteredBlogPage.mockReturnValue(<div>filtered</div>)
        render(<Page />)
        expect(mockFilteredBlogPage).toHaveBeenCalledWith({
            posts: expect.arrayContaining([expect.objectContaining({ slug: 'a' }), expect.objectContaining({ slug: 'b' })]),
            tags: [BlogTag.Guide],
        })
    })

    it('renders every post while the client filter suspends', () => {
        mockFilteredBlogPage.mockImplementation(() => { throw new Promise(() => {}) })
        render(<Page />)
        expect(screen.getByText('Guide post')).toBeInTheDocument()
        expect(screen.getByText('News post')).toBeInTheDocument()
    })
})
