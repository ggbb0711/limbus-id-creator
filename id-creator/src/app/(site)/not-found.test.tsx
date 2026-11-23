import NotFoundPage from 'components/notFoundPage/NotFoundPage'
import SiteShell from 'components/layout/SiteShell'
import SiteNotFound, { metadata as siteMetadata } from './not-found'
import RootNotFound from '../not-found'

describe('not-found pages', () => {
    it('renders only the 404 content inside the site layout, which already has the shell', () => {
        const element = SiteNotFound()
        expect(element.type).toBe(NotFoundPage)
        expect(siteMetadata).toEqual({ title: 'Page not found' })
    })

    it('wraps unmatched URLs in the shell, since they skip the site layout', () => {
        const element = RootNotFound()
        expect(element.type).toBe(SiteShell)
        expect(element.props.children.type).toBe(NotFoundPage)
    })
})
