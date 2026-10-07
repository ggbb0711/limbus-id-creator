import React from 'react'
import { render, screen } from '@testing-library/react'
import TagChip from './TagChip'

const tag = { icon: '/Images/status-effect/Burn.webp', tagName: 'Burn' }

describe('TagChip', () => {
    it('renders a plain chip without a link', () => {
        const { container } = render(<TagChip tag={tag} className="chip" iconClassName="icon" iconSize={10}/>)
        expect(screen.queryByRole('link')).not.toBeInTheDocument()
        expect(container.firstChild).toHaveClass('chip')
        expect(screen.getByText('Burn')).toBeInTheDocument()
    })

    it('renders the chip itself as a link when given an href', () => {
        render(<TagChip tag={tag} href="/forum?tag=Burn" className="chip" iconClassName="icon" iconSize={10}/>)
        const link = screen.getByRole('link', { name: 'Burn' })
        expect(link).toHaveAttribute('href', '/forum?tag=Burn')
        expect(link).toHaveClass('chip')
        expect(link.querySelector('img.icon')).toBeInTheDocument()
    })

    it('renders an icon-less tag', () => {
        render(<TagChip tag={{ icon: '', tagName: 'Identity' }} className="chip" iconClassName="icon" iconSize={10}/>)
        expect(screen.queryByRole('img')).not.toBeInTheDocument()
    })
})
