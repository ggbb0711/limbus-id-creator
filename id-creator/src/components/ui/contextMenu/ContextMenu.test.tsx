import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ContextMenu, { contextMenuParts as Menu } from './ContextMenu'

function setup() {
    const onSelect = jest.fn()
    const onSubSelect = jest.fn()
    render(<ContextMenu trigger={<div>target</div>}>
        <Menu.Item onSelect={onSelect}>First</Menu.Item>
        <Menu.Item onSelect={jest.fn()} disabled>Blocked</Menu.Item>
        <Menu.Separator/>
        <Menu.Sub>
            <Menu.SubTrigger>More</Menu.SubTrigger>
            <Menu.SubContent>
                <Menu.Item onSelect={onSubSelect}>Nested</Menu.Item>
            </Menu.SubContent>
        </Menu.Sub>
        <Menu.Item onSelect={jest.fn()} danger>Remove</Menu.Item>
    </ContextMenu>)
    return { onSelect, onSubSelect }
}

describe('ContextMenu', () => {
    it('stays closed until the trigger is right-clicked', () => {
        setup()
        expect(screen.queryByRole('menu')).not.toBeInTheDocument()
        fireEvent.contextMenu(screen.getByText('target'))
        expect(screen.getByRole('menu')).toBeInTheDocument()
    })

    it('runs the selected item', async () => {
        const { onSelect } = setup()
        fireEvent.contextMenu(screen.getByText('target'))
        await userEvent.click(screen.getByRole('menuitem', { name: 'First' }))
        expect(onSelect).toHaveBeenCalledTimes(1)
        expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    })

    it('marks disabled and danger items', () => {
        setup()
        fireEvent.contextMenu(screen.getByText('target'))
        expect(screen.getByRole('menuitem', { name: 'Blocked' })).toHaveAttribute('aria-disabled', 'true')
        expect(screen.getByRole('menuitem', { name: 'Remove' })).toHaveClass('menu-item', 'danger')
        expect(screen.getByRole('separator')).toBeInTheDocument()
    })

    it('opens a submenu', async () => {
        const { onSubSelect } = setup()
        fireEvent.contextMenu(screen.getByText('target'))
        await userEvent.click(screen.getByRole('menuitem', { name: 'More' }))
        await userEvent.click(await screen.findByRole('menuitem', { name: 'Nested' }))
        expect(onSubSelect).toHaveBeenCalledTimes(1)
    })
})
