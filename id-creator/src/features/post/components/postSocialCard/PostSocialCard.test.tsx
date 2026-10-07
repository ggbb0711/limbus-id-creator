import { render, screen } from '@testing-library/react'
import PostSocialCard from './PostSocialCard'
import { IPost } from 'features/post/types/IPost'

const post: IPost = {
    id: 'p', title: 'x'.repeat(200), imagesAttach: [], description: '', userIcon: '', userName: 'Meph', userId: 'u',
    tags: ['Faust', 'Bleed', 'Burn', 'Sinking', 'Poise'], viewCount: 5, commentCount: 2, created: '2026-10-01T09:30:00',
}

describe('PostSocialCard', () => {
    it('renders a text-only post card when no image could be loaded', () => {
        const { container } = render(<PostSocialCard post={post} image={null} avatar={null} siteIcon={null}/>)
        expect(container.querySelector('img')).toBeNull()
        expect(screen.getByText(/^x+…$/).textContent).toHaveLength(110)
        expect(screen.getByText('by Meph')).toBeInTheDocument()
        expect(screen.getByText('Oct 1, 2026 · 5 views · 2 comments')).toBeInTheDocument()
    })

    it('shows at most four tag names', () => {
        render(<PostSocialCard post={post} image="data:image/png;base64,A" avatar={null} siteIcon={null}/>)
        expect(screen.getByText('Sinking')).toBeInTheDocument()
        expect(screen.queryByText('Poise')).not.toBeInTheDocument()
    })
})
