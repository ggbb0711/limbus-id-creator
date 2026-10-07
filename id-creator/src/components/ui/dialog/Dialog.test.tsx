import React, { useState } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import Dialog from './Dialog'

function Harness({ onClose = jest.fn() }: { onClose?: () => void }) {
    const [open, setOpen] = useState(false)
    return <>
        <button onClick={() => setOpen(true)}>Open</button>
        <Dialog open={open} onClose={() => { onClose(); setOpen(false) }} label="Settings" className="c" backdropClassName="backdrop" contentClassName="content">
            <button>Inside</button>
        </Dialog>
    </>
}

describe('Dialog', () => {
    it('renders nothing while closed', () => {
        render(<Harness/>)
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('opens labelled and modal, with focus inside', () => {
        render(<Harness/>)
        fireEvent.click(screen.getByText('Open'))
        const dialog = screen.getByRole('dialog', { name: 'Settings' })
        expect(dialog).toHaveAttribute('aria-modal', 'true')
        expect(dialog).toHaveFocus()
    })

    it('closes with Escape and returns focus to the trigger', () => {
        const onClose = jest.fn()
        render(<Harness onClose={onClose}/>)
        const trigger = screen.getByText('Open')
        trigger.focus()
        fireEvent.click(trigger)
        fireEvent.keyDown(document, { key: 'Escape' })
        expect(onClose).toHaveBeenCalledTimes(1)
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
        expect(trigger).toHaveFocus()
    })

    it('closes on a backdrop click', () => {
        const onClose = jest.fn()
        const { container } = render(<Harness onClose={onClose}/>)
        fireEvent.click(screen.getByText('Open'))
        fireEvent.click(container.querySelector('.backdrop') as Element)
        expect(onClose).toHaveBeenCalled()
    })

    it('only closes the top dialog on Escape', () => {
        const outer = jest.fn()
        const inner = jest.fn()
        render(<Dialog onClose={outer} label="Outer" className="c" backdropClassName="b" contentClassName="d">
            <Dialog onClose={inner} label="Inner" className="c" backdropClassName="b" contentClassName="d"><p>x</p></Dialog>
        </Dialog>)
        fireEvent.keyDown(document, { key: 'Escape' })
        expect(inner).toHaveBeenCalledTimes(1)
        expect(outer).not.toHaveBeenCalled()
    })
})
