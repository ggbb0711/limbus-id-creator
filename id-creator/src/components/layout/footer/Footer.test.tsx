import React from 'react'
import { render, screen } from '@testing-library/react'
import Footer from './Footer'

jest.mock('next/link', () => {
    const MockLink = ({ href, prefetch, children, ...props }: { href: string, prefetch?: boolean | null, children: React.ReactNode }) =>
        <a href={href} data-prefetch={String(prefetch)} {...props}>{children}</a>
    return MockLink
})

describe('Footer', () => {
    it('renders the site links without viewport prefetch', () => {
        render(<Footer />)
        const hrefs = ['/', '/about', '/blog', '/contact', '/privacy-policy', '/terms-of-service']
        hrefs.forEach(href => {
            const link = screen.getAllByRole('link').find(a => a.getAttribute('href') === href)
            expect(link).toHaveAttribute('data-prefetch', 'false')
        })
    })

    it('links the fan content policy externally', () => {
        render(<Footer />)
        expect(screen.getByRole('link', { name: /Fan Content Policy/ })).toHaveAttribute('target', '_blank')
    })
})
