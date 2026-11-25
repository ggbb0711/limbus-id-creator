import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DropdownMenu, { dropdownMenuParts as Menu } from './DropdownMenu'

function setup() {
    const onSelect = jest.fn()
    const onSubSelect = jest.fn()
    render(<DropdownMenu trigger={<button type="button">Open</button>}>
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
    </DropdownMenu>)
    return { onSelect, onSubSelect }
}

describe('DropdownMenu', () => {
    it('opens from its trigger', async () => {
        setup()
        expect(screen.queryByRole('menu')).not.toBeInTheDocument()
        await userEvent.click(screen.getByRole('button', { name: 'Open' }))
        expect(screen.getByRole('menu')).toBeInTheDocument()
    })

    it('runs the selected item and closes', async () => {
        const { onSelect } = setup()
        await userEvent.click(screen.getByRole('button', { name: 'Open' }))
        await userEvent.click(screen.getByRole('menuitem', { name: 'First' }))
        expect(onSelect).toHaveBeenCalledTimes(1)
        expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    })

    it('marks disabled and danger items', async () => {
        setup()
        await userEvent.click(screen.getByRole('button', { name: 'Open' }))
        expect(screen.getByRole('menuitem', { name: 'Blocked' })).toHaveAttribute('aria-disabled', 'true')
        expect(screen.getByRole('menuitem', { name: 'Remove' })).toHaveClass('menu-item', 'danger')
    })

    it('opens a submenu', async () => {
        const { onSubSelect } = setup()
        await userEvent.click(screen.getByRole('button', { name: 'Open' }))
        await userEvent.click(screen.getByRole('menuitem', { name: 'More' }))
        await userEvent.click(await screen.findByRole('menuitem', { name: 'Nested' }))
        expect(onSubSelect).toHaveBeenCalledTimes(1)
    })
})
