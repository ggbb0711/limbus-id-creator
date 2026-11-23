import { render, screen } from '@testing-library/react'
import AboutPage from './AboutPage'
import ContactPage from 'features/static/contactPage/ContactPage'
import { SITE_LINKS } from 'config/siteLinks'

describe('static pages', () => {
    it('links Ko-fi to the project page', () => {
        render(<AboutPage/>)
        expect(screen.getByRole('link', { name: 'Ko-fi' })).toHaveAttribute('href', 'https://ko-fi.com/johnlimbusidmaker')
        expect(screen.getByRole('link', { name: /Fan Content Policy/ })).toHaveAttribute('href', SITE_LINKS.fanContentPolicy)
    })

    it('renders each about section with a heading', () => {
        render(<AboutPage/>)
        expect(screen.getAllByRole('heading', { level: 2 }).map(h => h.textContent)).toEqual([
            'Creator Tools', 'Community', 'How the Site Is Run', 'Moderation', 'Your Data', 'Contact', 'Disclaimer', 'Support',
        ])
    })

    it('shows the contact email and Discord handle', () => {
        render(<AboutPage/>)
        expect(screen.getByRole('link', { name: SITE_LINKS.contactEmail })).toHaveAttribute('href', `mailto:${SITE_LINKS.contactEmail}`)
        expect(screen.getByText(SITE_LINKS.discordHandle)).toBeInTheDocument()
    })

    it.each([
        ['Terms of Service', '/terms-of-service'],
        ['Privacy Policy', '/privacy-policy'],
        ['Card Creator Guide', '/blog/card-creator-guide'],
        ['How to Share Your Creation', '/blog/how-to-post-your-creation'],
    ])('links to the %s', (name, href) => {
        render(<AboutPage/>)
        expect(screen.getByRole('link', { name })).toHaveAttribute('href', href)
    })

    it('has at least 400 words of text', () => {
        const { container } = render(<AboutPage/>)
        expect((container.textContent ?? '').split(/\s+/).filter(Boolean).length).toBeGreaterThanOrEqual(400)
    })

    it('shows the contact email from the site links', () => {
        render(<ContactPage/>)
        expect(screen.getByRole('link', { name: SITE_LINKS.contactEmail })).toHaveAttribute('href', `mailto:${SITE_LINKS.contactEmail}`)
    })
})
