import React from 'react'
import { render } from '@testing-library/react'
import { createEgoInfo } from 'features/cardCreator/types/IEgoInfo'
import EgoPreviewBody from './EgoPreviewBody'

const skills = <div className="test-skills">skills</div>
const renderBody = (overrides: Parameters<typeof createEgoInfo>[0]) => render(<EgoPreviewBody info={createEgoInfo(overrides)} skills={skills}/>)

describe('EgoPreviewBody', () => {
    it('fills the card height with the skill area and pins sin resistance to the bottom', () => {
        const { container } = renderBody({})
        const area = container.querySelector('.content-container > .skill-area.ego-skill-area') as HTMLElement
        expect(area).toBeInTheDocument()
        expect(area.style.maxHeight).toBe('')
        expect(area.querySelector('.test-skills')).toBeInTheDocument()
        expect(area.querySelector('.sin-cost-container')).toBeInTheDocument()
        expect(container.querySelector('.content-container')?.lastElementChild).toHaveClass('sin-resistant-container')
    })

    it('keeps the circle beside the content in horizontal layout', () => {
        const { container } = renderBody({ splashArt: 'data:image/png;base64,abc' })
        expect(container.querySelector('.ego-splash-art-container .ego-splash-art')).toBeInTheDocument()
        expect(container.querySelector('.content-container .sin-cost-container')).toBeInTheDocument()
    })

    it('puts the circle on top, then skills with sin cost, then sin resistance in vertical layout', () => {
        const { container } = renderBody({ cardLayout: 'Vertical', splashArt: 'data:image/png;base64,abc' })
        expect(container.querySelector('.content-container')).toBeNull()
        expect(container.querySelector('.ego-vertical-top .ego-splash-art')).toBeInTheDocument()
        expect(container.querySelector('.ego-vertical-top .vertical-header .header-container')).toBeInTheDocument()
        expect(container.querySelector('.vertical-body .ego-vertical-row .test-skills')).toBeInTheDocument()
        expect(container.querySelector('.vertical-body .ego-vertical-row .sin-cost-container')).toBeInTheDocument()
        expect(container.querySelector('.vertical-body > .sin-resistant-container')).toBeInTheDocument()
    })

    it('shows only the header row on top when there is no splash art in vertical layout', () => {
        const { container } = renderBody({ cardLayout: 'Vertical', splashArt: '' })
        expect(container.querySelector('.ego-vertical-top')).toBeNull()
        expect(container.querySelector('.vertical-header-flow .header-container')).toBeInTheDocument()
    })

    it.each([
        ['Horizontal', 'data:image/png;base64,abc'],
        ['Vertical', 'data:image/png;base64,abc'],
        ['Vertical', ''],
    ] as const)('puts the sanity cost on its own row under the name and title (%s, splash art %p)', (cardLayout, splashArt) => {
        const { container } = renderBody({ cardLayout, splashArt, sanityCost: 25 })
        const header = container.querySelector('.header-container') as HTMLElement
        const sanity = container.querySelector('.sanity-cost-container')
        expect(container.querySelector('.name-field')?.parentElement?.querySelector('.sanity-cost-container')).toBeNull()
        expect(sanity?.parentElement).toBe(header)
        expect(header.lastElementChild).toBe(sanity)
        expect(sanity).toHaveTextContent('25')
    })
})
