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
        expect(screen.getAllByRole('heading', { level: 2 }).map(h => h.textContent)).toEqual(['Creator Tools', 'Community', 'Disclaimer', 'Support'])
    })

    it('shows the contact email from the site links', () => {
        render(<ContactPage/>)
        expect(screen.getByRole('link', { name: SITE_LINKS.contactEmail })).toHaveAttribute('href', `mailto:${SITE_LINKS.contactEmail}`)
    })
})
