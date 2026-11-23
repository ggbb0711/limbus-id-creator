import React from 'react'
import { render, screen } from '@testing-library/react'
import SinnerStats from './SinnerStats'

const props = {
    minSpeed: 3, maxSpeed: 7, hp: 187, staggerResist: '65% 40% 15%', defenseLevel: 43,
    slashResistant: 0.5, pierceResistant: 1, bluntResistant: 2, sinnerColor: 'rgb(255, 149, 0)',
}

describe('SinnerStats', () => {
    it('shows every stat in one strip', () => {
        const { container } = render(<SinnerStats {...props}/>)
        expect(container.querySelectorAll('.stat-container')).toHaveLength(1)
        expect(container.querySelectorAll('.stat-container-slot')).toHaveLength(7)
        expect(screen.getByText('3 - 7')).toBeInTheDocument()
        expect(screen.getByText('187')).toBeInTheDocument()
        expect(screen.getByText('43')).toBeInTheDocument()
        expect(screen.getByText('Stagger Threshold')).toBeInTheDocument()
        expect(screen.getByText('65% 40% 15%')).toBeInTheDocument()
    })

    it('labels each resistance with its tier and multiplier', () => {
        render(<SinnerStats {...props}/>)
        expect(screen.getByAltText('Slash resistance')).toBeInTheDocument()
        expect(screen.getByAltText('Pierce resistance')).toBeInTheDocument()
        expect(screen.getByAltText('Blunt resistance')).toBeInTheDocument()
        expect(screen.getByText('[x0.5]')).toBeInTheDocument()
        expect(screen.getByText('[x1]')).toBeInTheDocument()
        expect(screen.getByText('[x2]')).toBeInTheDocument()
    })

    it('colors the warning border with the sinner color and hides it from screen readers', () => {
        const { container } = render(<SinnerStats {...props}/>)
        const border = container.querySelector('.sinner-stats-border')
        expect(border).toHaveStyle({ color: 'rgb(255, 149, 0)' })
        expect(border).toHaveAttribute('aria-hidden', 'true')
    })

    it('tiles the warning text with an svg pattern that fills the whole strip', () => {
        const { container } = render(<SinnerStats {...props}/>)
        const svg = container.querySelector('.sinner-stats-border svg')
        const fill = svg?.querySelector('rect')?.getAttribute('fill')
        const id = fill?.match(/^url\(#(.+)\)$/)?.[1]
        expect(id).toBeTruthy()
        const pattern = svg?.querySelector(`pattern[id="${id}"]`)
        expect(pattern).not.toBeNull()
        expect(pattern).toHaveTextContent('WARNING ////')
        expect(container.querySelectorAll('.sinner-stats-border span')).toHaveLength(0)
    })

    it('gives each instance its own pattern id', () => {
        const { container } = render(<><SinnerStats {...props}/><SinnerStats {...props}/></>)
        const ids = Array.from(container.querySelectorAll('pattern')).map(p => p.id)
        expect(ids).toHaveLength(2)
        expect(ids[0]).not.toBe(ids[1])
    })
})
