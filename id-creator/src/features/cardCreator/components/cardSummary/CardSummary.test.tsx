import React from 'react'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CardSummary from './CardSummary'
import { createIdInfo } from 'features/cardCreator/types/IIdInfo'
import { createEgoInfo } from 'features/cardCreator/types/IEgoInfo'
import { createOffenseSkill } from 'features/cardCreator/types/skills/offenseSkill/IOffenseSkill'
import { createPassiveSkill } from 'features/cardCreator/types/skills/passiveSkill/IPassiveSkill'
import { createMentalEffect } from 'features/cardCreator/types/skills/mentalEffect/IMentalEffect'
import { createCustomEffect } from 'features/cardCreator/types/skills/customEffect/ICustomEffect'
import { customEffectHtml } from 'features/cardCreator/utils/keywords/keywords'

const identity = () => createIdInfo({
    title: 'LCB Sinner',
    name: 'Faust',
    hp: 123,
    skillDetails: [
        createOffenseSkill({ name: 'Slice', skillEffect: '<p>Inflict 2 Bleed</p><script>alert(1)</script>' }),
        createPassiveSkill({ name: 'Steady', skillEffect: '<p>Gain 1 Poise</p>' }),
        createMentalEffect({ effect: '<p>Win a clash</p>' }),
    ],
})

describe('CardSummary', () => {
    it('shows the name, stats and every group of skills in the HTML', () => {
        const { container } = render(<CardSummary card={{ kind: 'Identity', info: identity() }}/>)

        expect(screen.getByRole('region', { name: 'LCB Sinner Faust' })).toBeInTheDocument()
        expect(container).toHaveTextContent('123')
        expect(container).toHaveTextContent('Slice')
        expect(container).toHaveTextContent('Inflict 2 Bleed')
        expect(container).toHaveTextContent('Steady')
        expect(container).toHaveTextContent('Gain 1 Poise')
        expect(container).toHaveTextContent('Win a clash')
        expect(container.querySelector('script')).toBeNull()
    })

    it('shows one tab per non-empty group and switches between them', async () => {
        const user = userEvent.setup()
        render(<CardSummary card={{ kind: 'Identity', info: identity() }}/>)
        const panelOf = (name: string) => document.getElementById(screen.getByRole('tab', { name }).getAttribute('aria-controls')!)!

        expect(screen.getAllByRole('tab').map(tab => tab.textContent)).toEqual(['Skills', 'Passives', 'Effects'])
        expect(panelOf('Skills')).toBeVisible()
        expect(panelOf('Passives')).not.toBeVisible()

        await user.click(screen.getByRole('tab', { name: 'Passives' }))

        expect(panelOf('Passives')).toBeVisible()
        expect(panelOf('Skills')).not.toBeVisible()
        expect(within(panelOf('Passives')).getByText('Steady')).toBeInTheDocument()
    })

    it('shows the splash art in the header', () => {
        const info = { ...identity(), splashArt: 'https://example.com/splash.webp' }
        const { container } = render(<CardSummary card={{ kind: 'Identity', info }}/>)

        expect(container.querySelector('.card-summary-header .card-summary-splash-art')).toHaveAttribute('src', 'https://example.com/splash.webp')
    })

    it('leaves out the splash art when there is none', () => {
        const { container } = render(<CardSummary card={{ kind: 'Identity', info: identity() }}/>)

        expect(container.querySelector('.card-summary-splash-art')).toBeNull()
    })

    it('leaves out tabs with nothing in them', () => {
        const info = createEgoInfo({ title: 'E.G.O', name: 'Faust', skillDetails: [createOffenseSkill({ name: 'Strike' })] })
        render(<CardSummary card={{ kind: 'Ego', info }}/>)

        expect(screen.getAllByRole('tab').map(tab => tab.textContent)).toEqual(['Skills'])
    })

    it('opens the status effect popup for a custom effect with a description', async () => {
        const user = userEvent.setup()
        const fanatic = createCustomEffect({ name: 'Fanatic', effect: '<p>Skill Final Power +X</p>' })
        const blank = createCustomEffect({ name: 'Blank', effect: '' })
        const info = createIdInfo({
            title: 'LCB Sinner',
            name: 'Faust',
            skillDetails: [
                createOffenseSkill({ name: 'Slice', skillEffect: `<p><span data-status-effect="x">${customEffectHtml(fanatic)}</span> and <span data-status-effect="y">${customEffectHtml(blank)}</span></p>` }),
                fanatic,
                blank,
            ],
        })
        const { container } = render(<CardSummary card={{ kind: 'Identity', info }}/>)
        const [fanaticSpan, blankSpan] = Array.from(container.querySelectorAll('[role="tabpanel"] [data-status-effect]'))

        await user.click(blankSpan)
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

        await user.click(fanaticSpan)
        expect(screen.getByRole('dialog', { name: 'Fanatic' })).toHaveTextContent('Skill Final Power +X')
    })
})

