import { fireEvent, render, screen } from '@testing-library/react'
import AccordionSection from './AccordionSection'

describe('AccordionSection', () => {
    it('toggles with a button that reports its state', () => {
        render(<AccordionSection title="Stats"><input aria-label="Power"/></AccordionSection>)
        const header = screen.getByRole('button', { name: 'Stats' })
        expect(header).toHaveAttribute('aria-expanded', 'true')
        fireEvent.click(header)
        expect(header).toHaveAttribute('aria-expanded', 'false')
        expect(document.getElementById(header.getAttribute('aria-controls') as string)).toHaveAttribute('inert')
    })

    it('can start closed', () => {
        render(<AccordionSection title="Info" defaultOpen={false}><p>x</p></AccordionSection>)
        expect(screen.getByRole('button', { name: 'Info' })).toHaveAttribute('aria-expanded', 'false')
    })
})
