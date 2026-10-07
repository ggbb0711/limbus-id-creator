import { render, screen } from '@testing-library/react'
import PassiveSinnerSkill from './PassiveSinnerSkill'
import { IPassiveSkill, createPassiveSkill } from 'features/cardCreator/types/skills/passiveSkill/IPassiveSkill'

function renderPassive(reqOwn: Partial<IPassiveSkill['reqOwn']>, reqRes: Partial<IPassiveSkill['reqRes']> = {}) {
    const base = createPassiveSkill({ name: 'Test passive' })
    const skill = createPassiveSkill({ ...base, reqOwn: { ...base.reqOwn, ...reqOwn }, reqRes: { ...base.reqRes, ...reqRes } })
    return render(<PassiveSinnerSkill passiveSkill={skill} />)
}

describe('PassiveSinnerSkill requirements', () => {
    it('uses the capitalised icon file name that exists on disk', () => {
        renderPassive({ wrath: 1 })
        expect(screen.getByAltText('wrath_icon')).toHaveAttribute('src', '/Images/sin-affinity/affinity_Wrath_big.webp')
    })

    it('only renders requirements of at least 1', () => {
        renderPassive({ wrath: 2, envy: 0 }, { gloom: 3 })
        expect(screen.getByAltText('wrath_icon')).toBeInTheDocument()
        expect(screen.getByAltText('gloom_icon')).toBeInTheDocument()
        expect(screen.queryByAltText('envy_icon')).not.toBeInTheDocument()
    })

    it('renders no requirement block when everything is 0', () => {
        renderPassive({})
        expect(screen.queryByText('Own:')).not.toBeInTheDocument()
        expect(screen.queryByText('Res:')).not.toBeInTheDocument()
    })
})
