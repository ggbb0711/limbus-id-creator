import { act, fireEvent, render, screen } from '@testing-library/react'
import CopyButton from './CopyButton'

describe('CopyButton', () => {
    it('copies the text and confirms', async () => {
        const writeText = jest.fn().mockResolvedValue(undefined)
        Object.assign(navigator, { clipboard: { writeText } })
        render(<CopyButton text="_handle" label="Copy handle"/>)
        await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Copy handle' })) })
        expect(writeText).toHaveBeenCalledWith('_handle')
        expect(screen.getByRole('button', { name: 'Copy handle copied' })).toHaveTextContent('Copied')
    })

    it('stays usable when the clipboard is blocked', async () => {
        Object.assign(navigator, { clipboard: { writeText: jest.fn().mockRejectedValue(new Error('denied')) } })
        render(<CopyButton text="_handle" label="Copy handle"/>)
        await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Copy handle' })) })
        expect(screen.getByRole('button', { name: 'Copy handle' })).toHaveTextContent('Copy')
    })
})
