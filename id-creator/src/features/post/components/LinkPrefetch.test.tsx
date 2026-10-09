import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { makeStore } from 'stores/AppStore'
import { IPostDisplayCard } from 'features/post/types/IPostDisplayCard'
import { PostDisplayCard } from './paginatedPost/PostDisplayCard'
import AuthorBadge from './authorBadge/AuthorBadge'
import TagChip from './tagChip/TagChip'
import PostSidebar from './postSidebar/PostSidebar'

jest.mock('next/link', () => {
    const MockLink = ({ href, prefetch, children, ...props }: { href: string, prefetch?: boolean | null, children: React.ReactNode }) =>
        <a href={href} data-prefetch={String(prefetch)} {...props}>{children}</a>
    return MockLink
})

const card = (id: string): IPostDisplayCard => ({
    id, title: `Post ${id}`, cardImg: '/a.webp', userIcon: '/u.webp', userName: 'me', userId: 'u', created: '2024-01-01T00:00:00', tags: [], viewCount: 1, commentCount: 2,
})

const allLinks = (container: HTMLElement) => Array.from(container.querySelectorAll('a[href^="/"]'))

describe('repeated post links skip viewport prefetch', () => {
    it('post display card', () => {
        const { container } = render(<Provider store={makeStore()}><PostDisplayCard {...card('a')}/></Provider>)
        const links = allLinks(container)
        expect(links.length).toBeGreaterThan(0)
        links.forEach(link => expect(link).toHaveAttribute('data-prefetch', 'false'))
    })

    it('author badge', () => {
        render(<AuthorBadge userId="u" userName="me" userIcon="/u.webp" size={20} iconClassName="i"/>)
        expect(screen.getByRole('link')).toHaveAttribute('data-prefetch', 'false')
    })

    it('tag chip with a link', () => {
        render(<TagChip href="/forum?tag=x" className="c" iconClassName="i" iconSize={12}/>)
        expect(screen.getByRole('link')).toHaveAttribute('data-prefetch', 'false')
    })

    it('post sidebar items and view-all links', () => {
        const { container } = render(<PostSidebar author={{ userId: 'u', userName: 'me' }} authorPosts={[card('a')]} latestPosts={[card('b')]}/>)
        const links = allLinks(container)
        expect(links.length).toBe(4)
        links.forEach(link => expect(link).toHaveAttribute('data-prefetch', 'false'))
    })
})
