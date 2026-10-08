import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import SaveNameDialog from './SaveNameDialog'

const setup = (props: Partial<React.ComponentProps<typeof SaveNameDialog>> = {}) => {
    const onSubmit = jest.fn()
    const onClose = jest.fn()
    const utils = render(<SaveNameDialog open title="Name the new save" submitLabel="Create" initialName="My save" onSubmit={onSubmit} onClose={onClose} {...props}/>)
    return { ...utils, onSubmit, onClose, input: () => screen.getByLabelText('Enter the name of the save:') as HTMLInputElement }
}

describe('SaveNameDialog', () => {
    it('renders nothing while closed', () => {
        setup({ open: false })
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('shows a labelled dialog prefilled with the initial name', () => {
        const { input } = setup()
        expect(screen.getByRole('dialog', { name: 'Name the new save' })).toBeInTheDocument()
        expect(input().value).toBe('My save')
    })

    it('submits the trimmed name with the button and closes', () => {
        const { input, onSubmit, onClose } = setup()
        fireEvent.change(input(), { target: { value: '  Renamed  ' } })
        fireEvent.click(screen.getByRole('button', { name: 'Create' }))
        expect(onSubmit).toHaveBeenCalledWith('Renamed')
        expect(onClose).toHaveBeenCalled()
    })

    it('submits with Enter', () => {
        const { input, onSubmit } = setup()
        fireEvent.submit(input())
        expect(onSubmit).toHaveBeenCalledWith('My save')
    })

    it('does not submit a blank name', () => {
        const { input, onSubmit } = setup()
        fireEvent.change(input(), { target: { value: '   ' } })
        expect(screen.getByRole('button', { name: 'Create' })).toBeDisabled()
        fireEvent.submit(input())
        expect(onSubmit).not.toHaveBeenCalled()
    })

    it('resets to the new initial name when reopened', () => {
        const { input, rerender, onSubmit, onClose } = setup()
        fireEvent.change(input(), { target: { value: 'Draft' } })
        rerender(<SaveNameDialog open={false} title="t" submitLabel="Update" initialName="Other" onSubmit={onSubmit} onClose={onClose}/>)
        rerender(<SaveNameDialog open title="t" submitLabel="Update" initialName="Other" onSubmit={onSubmit} onClose={onClose}/>)
        expect(input().value).toBe('Other')
    })

    it('closes without submitting', () => {
        const { onSubmit, onClose } = setup()
        fireEvent.click(screen.getByRole('button', { name: 'Close' }))
        expect(onClose).toHaveBeenCalled()
        expect(onSubmit).not.toHaveBeenCalled()
    })
})
