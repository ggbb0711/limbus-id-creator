import React, { useRef } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { cycleIndex, useCombobox } from './useCombobox'

describe('cycleIndex', () => {
    it.each([
        [0, 3, 1, 1], [2, 3, 1, 0], [0, 3, -1, 2], [1, 3, -1, 0], [0, 0, 1, 0], [0, 0, -1, 0], [0, 1, 1, 0],
    ])('cycleIndex(%d, %d, %d) = %d', (index, length, direction, expected) => {
        expect(cycleIndex(index, length, direction as 1 | -1)).toBe(expected)
    })
})

function Harness({ onSelect }: { onSelect: (item: string) => void }) {
    const items = ['apple', 'banana', 'cherry']
    const containerRef = useRef<HTMLDivElement>(null)
    const combobox = useCombobox({ items, onSelect, containerRef })
    return <>
        <div ref={containerRef}>
            <input aria-label="Fruit" {...combobox.inputProps}/>
            <ul {...combobox.listProps}>
                {combobox.isOpen && items.map((item, i) => <li key={item} {...combobox.getOptionProps(i)}>{item}</li>)}
            </ul>
        </div>
        <p>outside</p>
    </>
}

describe('useCombobox', () => {
    it('opens on focus with combobox semantics', () => {
        render(<Harness onSelect={jest.fn()}/>)
        const input = screen.getByRole('combobox', { name: 'Fruit' })
        expect(input).toHaveAttribute('aria-expanded', 'false')
        fireEvent.focus(input)
        expect(input).toHaveAttribute('aria-expanded', 'true')
        expect(screen.getAllByRole('option')).toHaveLength(3)
        expect(input.getAttribute('aria-activedescendant')).toBe(screen.getByRole('option', { name: 'apple' }).id)
    })

    it('moves with the arrows, wraps around and selects with Enter', () => {
        const onSelect = jest.fn()
        render(<Harness onSelect={onSelect}/>)
        const input = screen.getByRole('combobox')
        fireEvent.focus(input)
        fireEvent.keyDown(input, { key: 'ArrowUp' })
        expect(screen.getByRole('option', { name: 'cherry' })).toHaveAttribute('aria-selected', 'true')
        fireEvent.keyDown(input, { key: 'ArrowDown' })
        fireEvent.keyDown(input, { key: 'ArrowDown' })
        fireEvent.keyDown(input, { key: 'Enter' })
        expect(onSelect).toHaveBeenCalledWith('banana')
        expect(screen.queryByRole('option')).not.toBeInTheDocument()
    })

    it('closes with Escape, Tab and an outside click', () => {
        render(<Harness onSelect={jest.fn()}/>)
        const input = screen.getByRole('combobox')
        fireEvent.focus(input)
        fireEvent.keyDown(input, { key: 'Escape' })
        expect(input).toHaveAttribute('aria-expanded', 'false')
        fireEvent.keyDown(input, { key: 'ArrowDown' })
        expect(input).toHaveAttribute('aria-expanded', 'true')
        fireEvent.keyDown(input, { key: 'Tab' })
        expect(input).toHaveAttribute('aria-expanded', 'false')
        fireEvent.focus(input)
        fireEvent.mouseDown(screen.getByText('outside'))
        expect(input).toHaveAttribute('aria-expanded', 'false')
    })

    it('selects an option on click', () => {
        const onSelect = jest.fn()
        render(<Harness onSelect={onSelect}/>)
        fireEvent.focus(screen.getByRole('combobox'))
        fireEvent.click(screen.getByRole('option', { name: 'cherry' }))
        expect(onSelect).toHaveBeenCalledWith('cherry')
    })
})
