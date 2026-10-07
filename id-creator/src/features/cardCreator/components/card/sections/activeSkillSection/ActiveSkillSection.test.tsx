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
        expect(screen.getAllByAltText('coin_icon')).toHaveLength(3)
    })

    it('draws special coins from the effect markup', () => {
        render(<CoinRow coinNo={2} skillEffect={`<span data-custom-coin-effect="coin-effect-2-unbreakable"></span>`}/>)
        expect(screen.getAllByAltText('coin_icon')).toHaveLength(1)
        expect(screen.getByAltText('unbreakable_coin_icon')).toBeInTheDocument()
    })

    it('collapses to one coin with a count past the limit', () => {
        const { container } = render(<CoinRow coinNo={MAX_DRAWN_COINS + 2} skillEffect=""/>)
        expect(screen.getAllByAltText('coin_icon')).toHaveLength(1)
        expect(container.textContent).toContain(`x ${MAX_DRAWN_COINS + 2}`)
    })
})

describe('active skill sections', () => {
    it('renders offense stats with an attack icon and the affinity placeholder', () => {
        render(<OffenseSinnerSkill offenseSkill={createOffenseSkill({ name: 'Slash it', basePower: 4, coinPow: 2, skillLevel: -1, damageType: 'Pierce', skillAffinity: 'Lust' })}/>)
        expect(screen.getByText('Slash it')).toBeInTheDocument()
        expect(screen.getByAltText('Pierce_icon')).toBeInTheDocument()
        expect(screen.getByAltText('attack_icon')).toBeInTheDocument()
        expect(screen.getByAltText('skill affinity')).toHaveAttribute('src', '/Images/sin-affinity/affinity_Lust_big.webp')
        expect(screen.getByText('-1')).toBeInTheDocument()
    })

    it('renders a guard with a defense icon and the optional splash icon', () => {
        render(<DefenseSinnerSkill defenseSkill={createDefenseSkill({ defenseType: 'Dodge', showDefenseIcon: true })}/>)
        expect(screen.getByAltText('Dodge_icon')).toBeInTheDocument()
        expect(screen.getByAltText('defense_icon')).toBeInTheDocument()
        expect(screen.getByAltText('defense_Dodge')).toBeInTheDocument()
        expect(screen.queryByAltText('skill affinity')).not.toBeInTheDocument()
    })

    it('hides the defense splash icon when turned off', () => {
        render(<DefenseSinnerSkill defenseSkill={createDefenseSkill({ defenseType: 'Block', showDefenseIcon: false })}/>)
        expect(screen.queryByAltText('defense_Block')).not.toBeInTheDocument()
    })

    it('omits the affinity header icon for None', () => {
        render(<OffenseSinnerSkill offenseSkill={createOffenseSkill({ skillAffinity: 'None' })}/>)
        expect(screen.queryByAltText('sinner-skill-None-icon')).not.toBeInTheDocument()
    })
})
