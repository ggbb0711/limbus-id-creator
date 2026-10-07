import React from 'react'
import { render, screen } from '@testing-library/react'
import { BlogTag } from './blogTags'
import FilteredBlogPage from './FilteredBlogPage'

let mockSearch = ''
jest.mock('next/navigation', () => ({ useSearchParams: () => new URLSearchParams(mockSearch) }))

const posts = [
    { slug: 'a', title: 'Guide post', description: '', published: '2026-01-01', tags: [BlogTag.Guide] },
    { slug: 'b', title: 'News post', description: '', published: '2026-01-02', tags: [] },
]

const renderWith = (search: string) => {
    mockSearch = search
    return render(<FilteredBlogPage posts={posts} tags={[BlogTag.Guide]} />)
}

describe('FilteredBlogPage', () => {
    it('shows every post without a tag', () => {
        renderWith('')
        expect(screen.getByText('Guide post')).toBeInTheDocument()
        expect(screen.getByText('News post')).toBeInTheDocument()
        expect(screen.getByRole('link', { name: 'All' })).toHaveClass('active')
    })

    it('filters by a valid tag and marks it active', () => {
        renderWith('tag=Guide')
        expect(screen.getByText('Guide post')).toBeInTheDocument()
        expect(screen.queryByText('News post')).not.toBeInTheDocument()
        expect(screen.getByRole('link', { name: 'All' })).not.toHaveClass('active')
    })

    it('ignores an unknown tag', () => {
        renderWith('tag=NotATag')
        expect(screen.getByText('Guide post')).toBeInTheDocument()
        expect(screen.getByText('News post')).toBeInTheDocument()
        expect(screen.getByRole('link', { name: 'All' })).toHaveClass('active')
    })

    it('ignores an empty tag', () => {
        renderWith('tag=')
        expect(screen.getByText('News post')).toBeInTheDocument()
    })
})
