import { fireEvent, render, screen } from '@testing-library/react'
import IconButton from './IconButton'
import BusyButton from 'components/ui/busyButton/BusyButton'

describe('IconButton', () => {
    it('is a labelled, non-submitting button', () => {
        const onClick = jest.fn()
        render(<form onSubmit={() => { throw new Error('submitted') }}><IconButton label="Remove" className="x" onClick={onClick}><svg/></IconButton></form>)
        const button = screen.getByRole('button', { name: 'Remove' })
        expect(button).toHaveAttribute('type', 'button')
        expect(button).toHaveClass('icon-button', 'x')
        fireEvent.click(button)
        expect(onClick).toHaveBeenCalled()
    })
})

describe('BusyButton', () => {
    it('shows its children when idle', () => {
        render(<BusyButton busy={false} busyText="Saving...">Save</BusyButton>)
        const button = screen.getByRole('button', { name: 'Save' })
        expect(button).not.toBeDisabled()
        expect(button).toHaveAttribute('aria-busy', 'false')
        expect(button).not.toHaveClass('active')
    })

    it('disables itself and shows the busy text while busy', () => {
        const onClick = jest.fn()
        render(<BusyButton busy busyText="Saving..." onClick={onClick}>Save</BusyButton>)
        const button = screen.getByRole('button', { name: 'Saving...' })
        expect(button).toBeDisabled()
        expect(button).toHaveAttribute('aria-busy', 'true')
        expect(button).toHaveClass('main-button', 'active')
        fireEvent.click(button)
        expect(onClick).not.toHaveBeenCalled()
    })

    it('keeps its children when no busy text is given', () => {
        render(<BusyButton busy>Save</BusyButton>)
        expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()
    })
})
