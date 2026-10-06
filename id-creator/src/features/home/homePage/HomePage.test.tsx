import { render, screen } from '@testing-library/react'
import HomePage from './HomePage'

describe('HomePage latest posts', () => {
    it('says posts are unavailable when the fetch failed', () => {
        render(<HomePage latestPosts={null}/>)
        expect(screen.getByRole('alert')).toHaveTextContent('Latest posts are unavailable right now')
        expect(screen.queryByText(/No posts yet/)).not.toBeInTheDocument()
    })

    it('shows the empty state for an empty list', () => {
        render(<HomePage latestPosts={[]}/>)
        expect(screen.getByText(/No posts yet/)).toBeInTheDocument()
    })

    it('renders the posts', () => {
        render(<HomePage latestPosts={[{ id: 'p', title: 'Hello', cardImg: '/a.webp', userIcon: '/u.webp', userName: 'me', userId: 'u', created: '2024-01-01T00:00:00', tags: ['Faust'], viewCount: 3, commentCount: 1 }]}/>)
        expect(screen.getByRole('link', { name: 'Hello' })).toHaveAttribute('href', '/post/p')
        expect(screen.getByText('Faust')).toBeInTheDocument()
        expect(screen.getByText('views', { exact: false })).toBeInTheDocument()
    })
})
