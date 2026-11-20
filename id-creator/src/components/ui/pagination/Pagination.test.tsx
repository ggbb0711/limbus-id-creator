import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { PaginationNav, pageCountOf } from './Pagination'

describe('pageCountOf', () => {
    it('counts pages safely', () => {
        expect(pageCountOf(13, 6)).toBe(3)
        expect(pageCountOf(0, 6)).toBe(0)
        expect(pageCountOf(5, 0)).toBe(5)
    })
})

describe('PaginationNav', () => {
    it('calls onChange with the clicked page index', () => {
        const onChange = jest.fn()
        render(<PaginationNav page={0} pageCount={3} onChange={onChange}/>)

        fireEvent.click(screen.getByRole('button', { name: 'Page 3' }))

        expect(onChange).toHaveBeenCalledWith(2)
    })

    it('marks the current page', () => {
        render(<PaginationNav page={1} pageCount={3} onChange={jest.fn()}/>)

        expect(screen.getByRole('button', { name: /Page 2/ })).toHaveAttribute('aria-current', 'page')
    })

    it('shows fewer page numbers in compact mode', () => {
        const { unmount } = render(<PaginationNav page={10} pageCount={20} onChange={jest.fn()}/>)
        const full = screen.getAllByRole('button', { name: /^Page \d+/ }).length
        unmount()

        render(<PaginationNav compact className="extra" page={10} pageCount={20} onChange={jest.fn()}/>)

        expect(screen.getAllByRole('button', { name: /^Page \d+/ }).length).toBeLessThan(full)
        expect(screen.getByRole('navigation', { name: 'Pagination' })).toHaveClass('extra')
    })
})
