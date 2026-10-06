import { render, screen } from '@testing-library/react'
import Spinner from './Spinner'

describe('Spinner', () => {
    it('renders the loader with an accessible label', () => {
        render(<Spinner/>)
        expect(screen.getByRole('status', { name: 'Loading' })).toHaveClass('loader')
    })
})
