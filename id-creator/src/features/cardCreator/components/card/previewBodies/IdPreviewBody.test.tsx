import React from 'react'
import { render } from '@testing-library/react'
import { createIdInfo } from 'features/cardCreator/types/IIdInfo'
import IdPreviewBody from './IdPreviewBody'

const skills = <div className="test-skills">skills</div>
const renderBody = (overrides: Parameters<typeof createIdInfo>[0]) => render(<IdPreviewBody info={createIdInfo(overrides)} skills={skills}/>)
const order = (container: HTMLElement, selectors: string[]) => {
    const all = Array.from(container.querySelectorAll(selectors.join(',')))
    return selectors.map(selector => all.findIndex(el => el.matches(selector)))
}

describe('IdPreviewBody', () => {
    it('leaves out the splash panel when there is no splash art', () => {
        const { container } = renderBody({ splashArt: '' })
        expect(container.querySelector('.splashArt-container')).toBeNull()
        expect(container.querySelector('.content-container .sinner-stats')).toBeInTheDocument()
    })

    it('shows the splash panel next to the content when there is splash art', () => {
        const { container } = renderBody({ splashArt: 'data:image/png;base64,abc' })
        expect(container.querySelector('.splashArt-container')).toBeInTheDocument()
        expect(container.querySelector('.content-container .sinner-stats')).toBeInTheDocument()
    })

    it('puts the stats under the skills in horizontal layout', () => {
        const { container } = renderBody({})
        const [skillsAt, statsAt] = order(container, ['.test-skills', '.sinner-stats'])
        expect(skillsAt).toBeLessThan(statsAt)
    })

    it('stacks splash art, stats and skills in vertical layout', () => {
        const { container } = renderBody({ cardLayout: 'Vertical', splashArt: 'data:image/png;base64,abc' })
        expect(container.querySelector('.content-container')).toBeNull()
        const [splashAt, statsAt, skillsAt] = order(container, ['.vertical-splash', '.sinner-stats', '.test-skills'])
        expect(splashAt).toBeLessThan(statsAt)
        expect(statsAt).toBeLessThan(skillsAt)
        expect(container.querySelector('.vertical-splash .vertical-header .header-container')).toBeInTheDocument()
    })

    it.each(['data:image/png;base64,abc', ''])('shows the sinner icon by the header in vertical layout (splash art %p)', (splashArt) => {
        const { container } = renderBody({ cardLayout: 'Vertical', splashArt, sinnerIcon: '/Images/sinner-icon/Faust_Icon.webp' })
        expect(container.querySelector('.vertical-header-block .vertical-sinner-icon')).toHaveAttribute('src', '/Images/sinner-icon/Faust_Icon.webp')
    })

    it('uses the spaced header row when there is no splash art in vertical layout', () => {
        const { container } = renderBody({ cardLayout: 'Vertical', splashArt: '' })
        expect(container.querySelector('.vertical-splash')).toBeNull()
        expect(container.querySelector('.vertical-header-flow .header-container')).toBeInTheDocument()
    })
})
