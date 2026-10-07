import { render } from '@testing-library/react'
import SplashArt from './SplashArt'

const props = { splashArt: 'data:image/png;base64,a', splashArtScale: 2, splashArtTranslation: { x: 3, y: 4 } }

describe('SplashArt', () => {
    it('renders the id variant with blurred edges', () => {
        const { container } = render(<SplashArt variant="id" {...props}/>)
        expect(container.querySelector('.sinner-splash-art-container img.splashArtImg')).toBeInTheDocument()
        expect(container.querySelector('.splashArt-container-blur-edges')).toBeInTheDocument()
    })

    it('renders the ego variant without blurred edges', () => {
        const { container } = render(<SplashArt variant="ego" {...props}/>)
        expect(container.querySelector('.ego-splash-art img.egoSplashArtImg')).toBeInTheDocument()
        expect(container.querySelector('.splashArt-container-blur-edges')).not.toBeInTheDocument()
    })

    it('applies the transform and skips the image when empty', () => {
        const { container } = render(<SplashArt variant="id" {...props} splashArt=""/>)
        expect(container.querySelector('img')).not.toBeInTheDocument()
        expect(container.innerHTML).toContain('translate(3px, 4px) scale(2)')
    })
})
