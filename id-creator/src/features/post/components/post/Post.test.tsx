import React from 'react'
import { render, screen } from '@testing-library/react'
import Post from './Post'
import { IPost } from 'features/post/types/IPost'

jest.mock('features/post/components/postCardDetails/PostCardsView', () => ({
    __esModule: true,
    default: ({ images, alts, summaries }: { images: string[], alts?: (string | undefined)[], summaries: unknown[] }) => <>
        <p>card details {images.join(',')} summaries {summaries.filter(Boolean).length}</p>
        <p>alts {alts?.map(alt => alt ?? 'fallback').join('|')}</p>
    </>,
}))
jest.mock('features/cardCreator', () => ({
    ...jest.requireActual('features/cardCreator'),
    CardSummary: () => null,
}))
jest.mock('./LivePostStats', () => ({ __esModule: true, default: () => null }))
jest.mock('features/post/components/shareMenu/ShareMenu', () => ({ __esModule: true, default: () => null }))
jest.mock('features/post/components/authorBadge/AuthorBadge', () => ({ __esModule: true, default: () => null }))
jest.mock('features/post/components/postOwnerActions/PostOwnerActions', () => ({
    __esModule: true,
    default: ({ postId, userId }: { postId: string, userId: string }) => <p>owner actions {postId} {userId}</p>,
}))

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

describe('Post owner actions', () => {
    it('passes the post and author ids to the owner actions', () => {
        render(<Post post={post([])}/>)
        expect(screen.getByText('owner actions p1 u')).toBeInTheDocument()
    })
})

describe('Post card details', () => {
    it('shows every slide image with a summary only where the slide has a card', () => {
        const withSlides = { ...post([]), slides: [
            { imageUrl: 'a', card: { id: 'c', position: 0, kind: 'Identity', imageUrl: 'a', saveInfo: { name: 'Faust' } } },
            { imageUrl: 'b', card: null },
        ] } as IPost
        render(<Post post={withSlides}/>)
        expect(screen.getByText('card details a,b summaries 1')).toBeInTheDocument()
    })

    it('builds a summary for identity and ego cards and skips cards without saved data', () => {
        const card = (kind: string, saveInfo: unknown) => ({ id: kind, position: 0, kind, imageUrl: kind, saveInfo })
        const withSlides = { ...post([]), slides: [
            { imageUrl: 'a', card: card('Identity', { name: 'Faust' }) },
            { imageUrl: 'b', card: card('Ego', { name: 'Ego', egoLevel: 'HE' }) },
            { imageUrl: 'c', card: card('Identity', 'text') },
            { imageUrl: 'd', card: card('Identity', null) },
        ] } as IPost
        render(<Post post={withSlides}/>)
        expect(screen.getByText('card details a,b,c,d summaries 2')).toBeInTheDocument()
    })

    it('describes each card image by its card name, kind and author and leaves the rest to the carousel fallback', () => {
        const card = (kind: string, saveInfo: unknown) => ({ id: kind, position: 0, kind, imageUrl: kind, saveInfo })
        const withSlides = { ...post([]), slides: [
            { imageUrl: 'a', card: card('Identity', { title: 'LCB Sinner', name: 'Faust' }) },
            { imageUrl: 'b', card: card('Ego', { name: 'Fluid Sac' }) },
            { imageUrl: 'c', card: null },
        ] } as IPost
        render(<Post post={withSlides}/>)
        expect(screen.getByText('alts LCB Sinner Faust custom Identity card by n|Fluid Sac custom E.G.O card by n|fallback')).toBeInTheDocument()
    })

    it('uses the same view for a post with only plain images', () => {
        render(<Post post={{ ...post([]), slides: [{ imageUrl: 'a' }, { imageUrl: 'b' }] } as IPost}/>)
        expect(screen.getByText('card details a,b summaries 0')).toBeInTheDocument()
    })

    it('shows when the post was edited', () => {
        render(<Post post={{ ...post([]), updated: '2024-02-03T00:00:00' }}/>)
        expect(screen.getByText(/Edited:/)).toBeInTheDocument()
    })
})
