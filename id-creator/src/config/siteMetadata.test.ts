import { pageMetadata, siteMetadata } from './siteMetadata'

describe('pageMetadata', () => {
    it('gives a page its own description, canonical and social cards', () => {
        const meta = pageMetadata({ title: 'About', description: 'About the tool', path: '/about' })
        expect(meta).toMatchObject({
            title: 'About',
            description: 'About the tool',
            alternates: { canonical: '/about' },
            openGraph: { title: 'About', description: 'About the tool', url: '/about', siteName: 'Limbus ID Creator' },
            twitter: { title: 'About', description: 'About the tool' },
        })
        expect(meta.description).not.toBe(siteMetadata.description)
    })
})
