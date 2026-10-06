import { render, screen } from '@testing-library/react'
import SinResistant from './SinResistant'
import SinCost from '../sinCost/SinCost'
import { createSinRecord } from 'features/cardCreator/constants'
import { getResistTier } from 'features/cardCreator/utils/card/getResistTier'

describe('SinResistant', () => {
    it('renders every sin with its tier', () => {
        render(<SinResistant sinResistant={{ ...createSinRecord(1), pride: 2 }}/>)
        expect(screen.getByAltText('Pride-resistant-icon')).toHaveAttribute('src', '/Images/sin-affinity/affinity_Pride_big.webp')
        expect(screen.getByText('[x2]')).toBeInTheDocument()
        expect(screen.getAllByText(getResistTier(1, 'sin').label)).toHaveLength(6)
    })
})

describe('SinCost', () => {
    it('renders seven costs and dims zero costs', () => {
        const { container } = render(<SinCost sinCost={{ ...createSinRecord(0), envy: 3 }}/>)
        const costs = container.querySelectorAll('.sin-cost')
        expect(costs).toHaveLength(7)
        expect((costs[6] as HTMLElement).style.color).toBe('rgb(235, 201, 168)')
        expect((costs[0] as HTMLElement).style.color).toBe('rgb(142, 138, 130)')
    })
})
