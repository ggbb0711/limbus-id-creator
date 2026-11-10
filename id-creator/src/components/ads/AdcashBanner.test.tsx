import React from 'react'
import { render, screen } from '@testing-library/react'
import AdcashBanner from './AdcashBanner'
import { AD_PLACEMENTS } from './adPlacements'

const originalMatchMedia = window.matchMedia

const mockViewport = (width: number) => {
    window.matchMedia = ((query: string) => {
        const minWidth = Number(/min-width: (\d+)px/.exec(query)?.[1] ?? 0)
        return { matches: width >= minWidth, media: query } as MediaQueryList
    })
}

describe('AdcashBanner', () => {
    beforeEach(() => {
        Object.assign(window, { aclib: { runBanner: jest.fn() } })
    })

    afterEach(() => {
        delete (window as { aclib?: unknown }).aclib
        window.matchMedia = originalMatchMedia
    })

    it('injects the widest matching zone and reserves its size', () => {
        mockViewport(1400)
        const { container } = render(<AdcashBanner variants={AD_PLACEMENTS.forumLeaderboard}/>)
        const slot = container.querySelector('.ad-slot-container') as HTMLElement
        expect(slot).toHaveAttribute('data-size', '728x90')
        expect(slot).toHaveStyle({ width: '728px', height: '90px' })
        const scripts = slot.querySelectorAll('script')
        expect(scripts).toHaveLength(1)
        expect(scripts[0].text).toContain("zoneId: '12429506'")
        expect(screen.getByRole('complementary', { name: 'Advertisement' })).toBeInTheDocument()
    })

    it('falls back to a smaller zone on narrow screens', () => {
        mockViewport(600)
        const { container } = render(<AdcashBanner variants={AD_PLACEMENTS.forumLeaderboard}/>)
        expect(container.querySelector('.ad-slot-container')).toHaveAttribute('data-size', '468x60')
        expect(container.querySelector('script')?.text).toContain("zoneId: '12431854'")
    })

    it('renders nothing when no variant fits', () => {
        mockViewport(800)
        const { container } = render(<AdcashBanner variants={AD_PLACEMENTS.postSidebarSkyscraper}/>)
        expect(container).toBeEmptyDOMElement()
    })

    it('renders nothing when the Adcash library is missing', () => {
        delete (window as { aclib?: unknown }).aclib
        mockViewport(1400)
        const { container } = render(<AdcashBanner variants={AD_PLACEMENTS.homeLeaderboard}/>)
        expect(container).toBeEmptyDOMElement()
    })

    it('clears the injected script on unmount', () => {
        mockViewport(1400)
        const { container, unmount } = render(<AdcashBanner variants={AD_PLACEMENTS.homeLeaderboard}/>)
        const slot = container.querySelector('.ad-slot-container') as HTMLElement
        unmount()
        expect(slot.childNodes).toHaveLength(0)
    })
})
