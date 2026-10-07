import React from 'react'
import { render, screen, within } from '@testing-library/react'
import PostSidebar from './PostSidebar'
import { IPostDisplayCard } from 'features/post/types/IPostDisplayCard'

const card = (id: string, cardImg = `/img/${id}.webp`) => ({
    id, title: `Post ${id}`, userName: 'Author', userId: 'u1', cardImg, created: '2024-01-01T00:00:00', tags: [], viewCount: 0, commentCount: 0, userIcon: '',
}) as unknown as IPostDisplayCard

const author = { userId: 'u1', userName: 'Author' }

describe('PostSidebar', () => {
    it('shows the author section and the latest section with view-all links', () => {
        render(<PostSidebar author={author} authorPosts={[card('a')]} latestPosts={[card('b')]}/>)
        const authorSection = screen.getByRole('region', { name: 'More from Author' })
        expect(within(authorSection).getByRole('link', { name: 'View all' })).toHaveAttribute('href', '/user/u1')
        expect(within(authorSection).getByRole('link', { name: /Post a/ })).toHaveAttribute('href', '/post/a')
        const latest = screen.getByRole('region', { name: 'Latest IDs & E.G.Os' })
        expect(within(latest).getByRole('link', { name: 'View all' })).toHaveAttribute('href', '/forum')
    })

    it('hides empty sections', () => {
        render(<PostSidebar author={author} authorPosts={[]} latestPosts={[card('b')]}/>)
        expect(screen.queryByRole('region', { name: 'More from Author' })).not.toBeInTheDocument()
    })

    it('renders nothing visible when both sections are empty', () => {
        render(<PostSidebar author={author} authorPosts={[]} latestPosts={[]}/>)
        expect(screen.queryByRole('region')).not.toBeInTheDocument()
    })

    it('shows the card image when there is one', () => {
        render(<PostSidebar author={author} authorPosts={[card('a'), card('c', '')]} latestPosts={[]}/>)
        expect(screen.getAllByRole('img')).toHaveLength(1)
    })
})
