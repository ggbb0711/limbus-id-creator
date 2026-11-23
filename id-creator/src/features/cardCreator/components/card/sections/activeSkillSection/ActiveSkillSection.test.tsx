import { render, screen } from '@testing-library/react'
import OffenseSinnerSkill from '../offenseSinnerSkill/OffenseSinnerSkill'
import DefenseSinnerSkill from '../defenseSinnerSkill/DefenseSinnerSkill'
import CoinRow from './CoinRow'
import { createOffenseSkill } from 'features/cardCreator/types/skills/offenseSkill/IOffenseSkill'
import { createDefenseSkill } from 'features/cardCreator/types/skills/defenseSkill/IDefenseSkill'
import { MAX_DRAWN_COINS } from 'features/cardCreator/utils/card/getCoinEffect'

describe('CoinRow', () => {
    it('draws one coin per coinNo', () => {
        render(<CoinRow coinNo={3} skillEffect=""/>)
        expect(screen.getAllByAltText('Coin')).toHaveLength(3)
    })

    it('draws special coins from the effect markup', () => {
        render(<CoinRow coinNo={2} skillEffect={`<span data-custom-coin-effect="coin-effect-2-unbreakable"></span>`}/>)
        expect(screen.getAllByAltText('Coin')).toHaveLength(1)
        expect(screen.getByAltText('Unbreakable coin')).toBeInTheDocument()
    })

    it('collapses to one coin with a count past the limit', () => {
        const { container } = render(<CoinRow coinNo={MAX_DRAWN_COINS + 2} skillEffect=""/>)
        expect(screen.getAllByAltText('Coin')).toHaveLength(1)
        expect(container.textContent).toContain(`x ${MAX_DRAWN_COINS + 2}`)
    })
})

describe('active skill sections', () => {
    it('renders offense stats with an attack icon and the affinity placeholder', () => {
        const { container } = render(<OffenseSinnerSkill offenseSkill={createOffenseSkill({ name: 'Slash it', basePower: 4, coinPow: 2, skillLevel: -1, damageType: 'Pierce', skillAffinity: 'Lust' })}/>)
        expect(screen.getByText('Slash it')).toBeInTheDocument()
        expect(screen.getByAltText('Pierce damage')).toBeInTheDocument()
        expect(screen.getByAltText('Attack level')).toBeInTheDocument()
        expect(screen.getByAltText('Lust affinity')).toHaveAttribute('src', '/Images/sin-affinity/affinity_Lust_big.webp')
        expect(container.querySelector('.placeholder-skill')).toHaveAttribute('alt', '')
        expect(screen.getByText('-1')).toBeInTheDocument()
    })

    it('renders a guard with a defense icon and the optional splash icon', () => {
        const { container } = render(<DefenseSinnerSkill defenseSkill={createDefenseSkill({ defenseType: 'Dodge', showDefenseIcon: true })}/>)
        expect(screen.getAllByAltText('Dodge defense')).toHaveLength(2)
        expect(screen.getByAltText('Defense level')).toBeInTheDocument()
        expect(container.querySelector('.placeholder-skill')).not.toBeInTheDocument()
    })

    it('hides the defense splash icon when turned off', () => {
        const { container } = render(<DefenseSinnerSkill defenseSkill={createDefenseSkill({ defenseType: 'Block', showDefenseIcon: false })}/>)
        expect(container.querySelector('.defense-icon-container')).not.toBeInTheDocument()
    })

    it('omits the affinity header icon for None', () => {
        render(<OffenseSinnerSkill offenseSkill={createOffenseSkill({ skillAffinity: 'None' })}/>)
        expect(screen.queryByAltText('None affinity')).not.toBeInTheDocument()
    })

    it('names an uploaded skill image after the skill and marks the frame decorative', () => {
        const { container } = render(<OffenseSinnerSkill offenseSkill={createOffenseSkill({ name: 'Slash it', skillImage: '/skill.webp', skillAffinity: 'Wrath' })}/>)
        expect(screen.getByAltText('Slash it skill image')).toHaveAttribute('src', '/skill.webp')
        expect(container.querySelector('.sin-frame')).toHaveAttribute('alt', '')
    })

    it('labels a clashable counter defense icon with spaced words', () => {
        render(<DefenseSinnerSkill defenseSkill={createDefenseSkill({ defenseType: 'ClashableCounter', showDefenseIcon: true })}/>)
        expect(screen.getByAltText('Clashable Counter defense')).toBeInTheDocument()
    })
})
