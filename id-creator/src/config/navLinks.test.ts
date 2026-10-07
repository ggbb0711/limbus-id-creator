import { NAV_LINKS } from './navLinks'

describe('NAV_LINKS', () => {
    it('lists the main sections in order, including the blog', () => {
        expect(NAV_LINKS).toEqual([
            { href: '/creator/identity', label: 'Create Id' },
            { href: '/creator/ego', label: 'Create Ego' },
            { href: '/forum', label: 'Forum' },
            { href: '/blog', label: 'Blog' },
        ])
    })
})
