import React from 'react'
import { render, screen } from '@testing-library/react'
import Post from './Post'
import { IPost } from 'features/post/types/IPost'

jest.mock('./PostCarousel', () => ({ __esModule: true, default: () => <p>plain carousel</p> }))
jest.mock('features/post/components/postCardDetails/PostCardsView', () => ({ __esModule: true, default: () => <p>card details</p> }))
jest.mock('./LivePostStats', () => ({ __esModule: true, default: () => null }))
jest.mock('features/post/components/shareMenu/ShareMenu', () => ({ __esModule: true, default: () => null }))
jest.mock('features/post/components/authorBadge/AuthorBadge', () => ({ __esModule: true, default: () => null }))

const post = (tags: string[]) => ({
    id: 'p1', title: 'Title', description: '<p>Body</p>', created: '2024-01-01T00:00:00', userId: 'u', userName: 'n', userIcon: '/u.webp',
    imagesAttach: [], tags, viewCount: 0, commentCount: 0,
}) as unknown as IPost

describe('Post tags', () => {
    it('links each known tag to the forum filtered by it', () => {
        render(<Post post={post(['Burn', 'Don_Quixote'])}/>)
        expect(screen.getByRole('link', { name: 'Burn' })).toHaveAttribute('href', '/forum?tag=Burn')
        expect(screen.getByRole('link', { name: 'Don Quixote' })).toHaveAttribute('href', '/forum?tag=Don_Quixote')
    })

    it('renders an unknown tag without a link', () => {
        const { container } = render(<Post post={post(['Unknown'])}/>)
        expect(screen.queryByRole('link')).not.toBeInTheDocument()
        expect(container.querySelector('.post-tag-list .card-tag')).toBeInTheDocument()
    })
})

describe('Post card details', () => {
    it('keeps the plain carousel when the post has no cards', () => {
        render(<Post post={post([])}/>)
        expect(screen.getByText('plain carousel')).toBeInTheDocument()
        expect(screen.queryByText('card details')).not.toBeInTheDocument()
    })

    it('shows card details when an image has a card', () => {
        const withCard = { ...post([]), imagesAttach: ['a'], cards: [{ position: 0, kind: 'Identity', imageUrl: 'a', saveInfo: { name: 'Faust' } }] } as IPost
        render(<Post post={withCard}/>)
        expect(screen.getByText('card details')).toBeInTheDocument()
    })

    it('shows when the post was edited', () => {
        render(<Post post={{ ...post([]), updated: '2024-02-03T00:00:00' }}/>)
        expect(screen.getByText(/Edited:/)).toBeInTheDocument()
    })
})
