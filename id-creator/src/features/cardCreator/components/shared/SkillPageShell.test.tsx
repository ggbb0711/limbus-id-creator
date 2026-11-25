import { fireEvent, render, screen } from '@testing-library/react'
import { SkillActionsProps } from 'features/cardCreator/types/SkillActions'
import SkillPageShell from './SkillPageShell'

jest.mock('features/cardCreator/components/skillActionsMenu/SkillActionsMenu', () => ({
    __esModule: true,
    SkillActionsDropdown: ({ type, canMoveUp }: SkillActionsProps) => <p>actions:{type}:{String(canMoveUp)}</p>,
}))

function setup() {
    const collapsePage = jest.fn()
    const actions: SkillActionsProps = {
        type: 'DefenseSkill',
        canMoveUp: false,
        canMoveDown: true,
        onChangeType: jest.fn(),
        onMove: jest.fn(),
        onDelete: jest.fn(),
    }
    const { container } = render(
        <SkillPageShell className="extra" collapsePage={collapsePage} actions={actions}>
            <p>child field</p>
        </SkillPageShell>
    )
    return { collapsePage, container }
}

describe('SkillPageShell', () => {
    it('renders its children inside the page', () => {
        const { container } = setup()
        expect(screen.getByText('child field')).toBeInTheDocument()
        expect(container.firstChild).toHaveClass('input-page', 'extra')
    })

    it('shows the skill type label from the registry', () => {
        setup()
        expect(screen.getByRole('heading', { name: 'Defense skill' })).toBeInTheDocument()
    })

    it('puts the skill actions menu in the header', () => {
        const { container } = setup()
        expect(container.querySelector('.input-page-icon-container')).toHaveTextContent('actions:DefenseSkill:false')
    })

    it('no longer has a delete button at the bottom', () => {
        setup()
        expect(screen.queryByText(/Delete the skill/)).not.toBeInTheDocument()
    })

    it('collapses the page', () => {
        const { collapsePage } = setup()
        fireEvent.click(screen.getByRole('button', { name: 'Collapse the input page' }))
        expect(collapsePage).toHaveBeenCalled()
    })
})
