import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Tabs, { Tab } from './Tabs'

const tabs: Tab[] = [
    { id: 'one', label: 'One', panel: <p>First panel</p> },
    { id: 'two', label: 'Two', panel: <p>Second panel</p> },
    { id: 'three', label: 'Three', panel: <p>Third panel</p> },
]

const panelOf = (name: string) => document.getElementById(screen.getByRole('tab', { name }).getAttribute('aria-controls')!)!

describe('Tabs', () => {
    it('selects the first tab and keeps the other panels in the page but hidden', () => {
        render(<Tabs tabs={tabs} label="Example"/>)

        expect(screen.getByRole('tablist', { name: 'Example' })).toBeInTheDocument()
        expect(screen.getAllByRole('tab').map(tab => tab.textContent)).toEqual(['One', 'Two', 'Three'])
        expect(screen.getByRole('tab', { name: 'One' })).toHaveAttribute('aria-selected', 'true')
        expect(screen.getByText('First panel')).toBeVisible()
        expect(screen.getByText('Second panel')).not.toBeVisible()
        expect(screen.getByText('Third panel')).not.toBeVisible()
    })

    it('links each tab to its panel', () => {
        render(<Tabs tabs={tabs} label="Example"/>)

        expect(panelOf('Two')).toHaveTextContent('Second panel')
        expect(panelOf('Two')).toHaveAttribute('role', 'tabpanel')
    })

    it('switches panels on click', async () => {
        const user = userEvent.setup()
        render(<Tabs tabs={tabs} label="Example"/>)

        await user.click(screen.getByRole('tab', { name: 'Two' }))

        expect(screen.getByRole('tab', { name: 'Two' })).toHaveAttribute('aria-selected', 'true')
        expect(screen.getByText('Second panel')).toBeVisible()
        expect(screen.getByText('First panel')).not.toBeVisible()
    })

    it('moves between tabs with the arrow, Home and End keys', async () => {
        const user = userEvent.setup()
        render(<Tabs tabs={tabs} label="Example"/>)

        await user.click(screen.getByRole('tab', { name: 'One' }))
        await user.keyboard('{ArrowRight}')
        expect(screen.getByRole('tab', { name: 'Two' })).toHaveFocus()
        expect(screen.getByText('Second panel')).toBeVisible()

        await user.keyboard('{ArrowLeft}')
        expect(screen.getByRole('tab', { name: 'One' })).toHaveFocus()
        expect(screen.getByText('First panel')).toBeVisible()

        await user.keyboard('{End}')
        expect(screen.getByRole('tab', { name: 'Three' })).toHaveFocus()
        expect(screen.getByText('Third panel')).toBeVisible()

        await user.keyboard('{Home}')
        expect(screen.getByRole('tab', { name: 'One' })).toHaveFocus()
        expect(screen.getByText('First panel')).toBeVisible()
    })

    it('renders an empty tab list without tabs', () => {
        render(<Tabs tabs={[]} label="Empty"/>)

        expect(screen.getByRole('tablist', { name: 'Empty' })).toBeInTheDocument()
        expect(screen.queryAllByRole('tab')).toHaveLength(0)
    })
})
