import { render, screen } from '@testing-library/react'
import { SKILL_VIEWS } from './SkillRegistry'
import { SKILL_TYPES } from 'features/cardCreator/types/SkillTypes'
import SkillCardSection from 'features/cardCreator/components/card/components/skillCardSection/SkillCardSection'
import { createMentalEffect } from 'features/cardCreator/types/skills/mentalEffect/IMentalEffect'
import { createPassiveSkill } from 'features/cardCreator/types/skills/passiveSkill/IPassiveSkill'

describe('SKILL_VIEWS', () => {
    it('has a view for every skill type', () => {
        expect(Object.keys(SKILL_VIEWS)).toEqual([...SKILL_TYPES])
    })
})

describe('SkillCardSection', () => {
    it('renders the mental effect section for a mental effect', () => {
        render(<SkillCardSection skill={createMentalEffect({ effect: '<p>calm</p>' })}/>)
        expect(screen.getByText('SANITY')).toBeInTheDocument()
        expect(screen.getByText('calm')).toBeInTheDocument()
    })

    it('renders the passive section for a passive skill', () => {
        render(<SkillCardSection skill={createPassiveSkill({ name: 'Steady', skillLabel: 'PASSIVE' })}/>)
        expect(screen.getByText('Steady')).toBeInTheDocument()
        expect(screen.queryByText('SANITY')).not.toBeInTheDocument()
    })
})
