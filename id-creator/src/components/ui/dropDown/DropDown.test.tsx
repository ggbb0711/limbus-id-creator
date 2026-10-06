import { fireEvent, render, screen } from '@testing-library/react'
import DropDown, { DropDownOption } from './DropDown'

const options: DropDownOption<string>[] = [
    { value: 'a', el: <span>Alpha</span> },
    { value: 'b', el: <span>Beta</span> },
    { value: 'c', el: <span>Gamma</span> },
]

function setup(value?: string) {
    const onChange = jest.fn()
    render(<><DropDown options={options} value={value} onChange={onChange} label="Pick"/><p>outside</p></>)
    return { onChange, trigger: screen.getByRole('button', { name: 'Pick' }) }
}

describe('DropDown', () => {
    it('shows the selected option', () => {
        const { trigger } = setup('b')
        expect(trigger).toHaveTextContent('Beta')
    })

    it('falls back to the first option for an unknown value', () => {
        const { trigger } = setup('missing')
        expect(trigger).toHaveTextContent('Alpha')
    })

    it('opens a listbox and calls onChange with the chosen value', () => {
        const { trigger, onChange } = setup('a')
        fireEvent.click(trigger)
        expect(trigger).toHaveAttribute('aria-expanded', 'true')
        fireEvent.click(screen.getByRole('option', { name: 'Gamma' }))
        expect(onChange).toHaveBeenCalledWith('c')
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    })

    it('marks the selected option', () => {
        const { trigger } = setup('b')
        fireEvent.click(trigger)
        expect(screen.getByRole('option', { name: 'Beta' })).toHaveAttribute('aria-selected', 'true')
    })

    it('supports the keyboard', () => {
        const { trigger, onChange } = setup('a')
        fireEvent.keyDown(trigger, { key: 'ArrowDown' })
        expect(screen.getByRole('listbox')).toBeInTheDocument()
        fireEvent.keyDown(trigger, { key: 'ArrowDown' })
        fireEvent.keyDown(trigger, { key: 'ArrowDown' })
        fireEvent.keyDown(trigger, { key: 'ArrowDown' })
        fireEvent.keyDown(trigger, { key: 'Enter' })
        expect(onChange).toHaveBeenCalledWith('c')
    })

    it('closes with Escape without choosing', () => {
        const { trigger, onChange } = setup('a')
        fireEvent.click(trigger)
        fireEvent.keyDown(trigger, { key: 'Escape' })
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
        expect(onChange).not.toHaveBeenCalled()
    })

    it('closes when clicking outside', () => {
        const { trigger } = setup('a')
        fireEvent.click(trigger)
        fireEvent.mouseDown(screen.getByText('outside'))
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    })

    it('cannot open when disabled', () => {
        const onChange = jest.fn()
        render(<DropDown options={options} onChange={onChange} disabled label="Pick"/>)
        expect(screen.getByRole('button', { name: 'Pick' })).toBeDisabled()
    })
})
