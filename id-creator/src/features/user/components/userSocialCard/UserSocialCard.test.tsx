import { render, screen } from '@testing-library/react'
import UserSocialCard from './UserSocialCard'

describe('UserSocialCard', () => {
    it('renders the name and join date without an avatar', () => {
        const { container } = render(<UserSocialCard user={{ userName: 'Meph', createdAt: '2025-03-15T10:00:00' }} avatar={null} siteIcon={null}/>)
        expect(screen.getByText('Meph')).toBeInTheDocument()
        expect(screen.getByText('Joined Mar 15, 2025')).toBeInTheDocument()
        expect(container.querySelector('img')).toBeNull()
    })

    it('shows the avatar when it could be loaded', () => {
        const { container } = render(<UserSocialCard user={{ userName: 'Meph', createdAt: '2025-03-15T10:00:00' }} avatar="data:image/png;base64,A" siteIcon={null}/>)
        expect(container.querySelector('img')).toHaveAttribute('src', 'data:image/png;base64,A')
    })
})
