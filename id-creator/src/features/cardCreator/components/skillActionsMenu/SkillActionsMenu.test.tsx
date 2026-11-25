import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MoveDirection, SkillActionsProps } from 'features/cardCreator/types/SkillActions'
import { SKILL_TYPES } from 'features/cardCreator/types/SkillTypes'
import { SKILL_DATA } from 'features/cardCreator/skills/skillData'
import { SkillActionsDropdown, SkillContextMenu } from './SkillActionsMenu'

function makeActions(overrides: Partial<SkillActionsProps> = {}): SkillActionsProps {
    return {
        type: 'DefenseSkill',
        canMoveUp: true,
        canMoveDown: true,
        onChangeType: jest.fn(),
        onMove: jest.fn(),
        onDelete: jest.fn(),
        ...overrides,
    }
}

async function openDropdown(actions: SkillActionsProps) {
    render(<SkillActionsDropdown {...actions}/>)
    await userEvent.click(screen.getByRole('button', { name: 'Skill actions' }))
}

describe('SkillActionsDropdown', () => {
    it('lists the skill actions', async () => {
        await openDropdown(makeActions())
        for (const name of ['Change type', 'Move up', 'Move down', 'Delete']) {
            expect(screen.getByRole('menuitem', { name })).toBeInTheDocument()
        }
    })

    it('changes to another type and disables the current one', async () => {
        const actions = makeActions()
        await openDropdown(actions)
        await userEvent.click(screen.getByRole('menuitem', { name: 'Change type' }))
        expect(await screen.findByRole('menuitem', { name: 'Defense skill' })).toHaveAttribute('aria-disabled', 'true')
        await userEvent.click(screen.getByRole('menuitem', { name: 'Passive skill' }))
        expect(actions.onChangeType).toHaveBeenCalledWith('PassiveSkill')
    })

    it('shows each type icon in the change type submenu', async () => {
        await openDropdown(makeActions())
        await userEvent.click(screen.getByRole('menuitem', { name: 'Change type' }))
        for (const type of SKILL_TYPES) {
            const item = await screen.findByRole('menuitem', { name: SKILL_DATA[type].label })
            expect(item.querySelector('img.menu-item-icon')).toHaveAttribute('src', SKILL_DATA[type].icon)
        }
    })

    it('moves up and down', async () => {
        const actions = makeActions()
        await openDropdown(actions)
        await userEvent.click(screen.getByRole('menuitem', { name: 'Move up' }))
        expect(actions.onMove).toHaveBeenCalledWith(MoveDirection.Up)
        await userEvent.click(screen.getByRole('button', { name: 'Skill actions' }))
        await userEvent.click(screen.getByRole('menuitem', { name: 'Move down' }))
        expect(actions.onMove).toHaveBeenCalledWith(MoveDirection.Down)
    })

    it('disables moving past either end', async () => {
        await openDropdown(makeActions({ canMoveUp: false, canMoveDown: false }))
        expect(screen.getByRole('menuitem', { name: 'Move up' })).toHaveAttribute('aria-disabled', 'true')
        expect(screen.getByRole('menuitem', { name: 'Move down' })).toHaveAttribute('aria-disabled', 'true')
    })

    it('deletes only after confirming', async () => {
        const actions = makeActions()
        await openDropdown(actions)
        await userEvent.click(screen.getByRole('menuitem', { name: 'Delete' }))
        expect(screen.getByText('Are you sure you want to delete this Defense skill?')).toBeInTheDocument()
        expect(actions.onDelete).not.toHaveBeenCalled()
        await userEvent.click(screen.getByRole('button', { name: 'Confirm' }))
        expect(actions.onDelete).toHaveBeenCalledTimes(1)
    })

    it('does not delete when cancelled', async () => {
        const actions = makeActions()
        await openDropdown(actions)
        await userEvent.click(screen.getByRole('menuitem', { name: 'Delete' }))
        await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))
        expect(actions.onDelete).not.toHaveBeenCalled()
        expect(screen.queryByText(/Are you sure/)).not.toBeInTheDocument()
    })
})

describe('SkillContextMenu', () => {
    function setup(actions = makeActions()) {
        render(<SkillContextMenu {...actions}><div>skill on card</div></SkillContextMenu>)
        fireEvent.contextMenu(screen.getByText('skill on card'))
        return actions
    }

    it('opens the same actions on right-click', () => {
        setup()
        for (const name of ['Change type', 'Move up', 'Move down', 'Delete']) {
            expect(screen.getByRole('menuitem', { name })).toBeInTheDocument()
        }
    })

    it('runs actions for the skill', async () => {
        const actions = setup(makeActions({ canMoveUp: false }))
        expect(screen.getByRole('menuitem', { name: 'Move up' })).toHaveAttribute('aria-disabled', 'true')
        await userEvent.click(screen.getByRole('menuitem', { name: 'Move down' }))
        expect(actions.onMove).toHaveBeenCalledWith(MoveDirection.Down)
    })

    it('confirms before deleting', async () => {
        const actions = setup()
        await userEvent.click(screen.getByRole('menuitem', { name: 'Delete' }))
        await userEvent.click(screen.getByRole('button', { name: 'Confirm' }))
        expect(actions.onDelete).toHaveBeenCalledTimes(1)
    })

    it('shows the delete confirmation full screen outside the card', async () => {
        const actions = makeActions()
        render(<div className="Card"><SkillContextMenu {...actions}><div>card skill</div></SkillContextMenu></div>)
        fireEvent.contextMenu(screen.getByText('card skill'))
        await userEvent.click(screen.getByRole('menuitem', { name: 'Delete' }))
        const dialog = screen.getByRole('alertdialog')
        expect(dialog.closest('.Card')).toBeNull()
        expect(dialog.closest('.confirm-dialog-container')?.parentElement).toBe(document.body)
    })
})
