import { fireEvent, render, screen } from '@testing-library/react'
import SkillPageShell from './SkillPageShell'

jest.mock('features/cardCreator/components/inputTab/components/changeInputType/ChangeInputType', () => ({
    __esModule: true,
    default: ({ type }: { type: string }) => <p>type:{type}</p>,
}))

function setup() {
    const onDelete = jest.fn()
    const collapsePage = jest.fn()
    const { container } = render(
        <SkillPageShell type="DefenseSkill" className="extra" collapsePage={collapsePage} onChangeType={jest.fn()} onDelete={onDelete}>
            <p>child field</p>
        </SkillPageShell>
    )
    return { onDelete, collapsePage, container }
}

describe('SkillPageShell', () => {
    it('renders its children inside the page', () => {
        const { container } = setup()
        expect(screen.getByText('child field')).toBeInTheDocument()
        expect(container.firstChild).toHaveClass('input-page', 'extra')
    })

    it('asks for confirmation using the registry label', () => {
        setup()
        fireEvent.click(screen.getByText(/Delete the skill/))
        expect(screen.getByText('Are you sure you want to delete this Defense skill?')).toBeInTheDocument()
    })

    it('does not delete when cancelled', () => {
        const { onDelete } = setup()
        fireEvent.click(screen.getByText(/Delete the skill/))
        fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
        expect(onDelete).not.toHaveBeenCalled()
        expect(screen.queryByText(/Are you sure/)).not.toBeInTheDocument()
    })

    it('deletes when confirmed', () => {
        const { onDelete } = setup()
        fireEvent.click(screen.getByText(/Delete the skill/))
        fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))
        expect(onDelete).toHaveBeenCalledTimes(1)
    })

    it('collapses the page', () => {
        const { collapsePage, container } = setup()
        fireEvent.click(container.querySelector('.collasp-icon') as Element)
        expect(collapsePage).toHaveBeenCalled()
    })
})
