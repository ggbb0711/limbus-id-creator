import React from 'react'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import RichTextEditor from './RichTextEditor'

const textbox = () => screen.getByRole('textbox', { name: 'Description' })

describe('RichTextEditor', () => {
    it('renders an accessible multiline textbox with the id', async () => {
        render(<RichTextEditor id="description" label="Description" value="" onChange={jest.fn()}/>)
        await waitFor(() => expect(textbox()).toHaveAttribute('aria-multiline', 'true'))
        expect(textbox()).toHaveAttribute('id', 'description')
    })

    it('shows the initial value', async () => {
        render(<RichTextEditor id="d" label="Description" value="<p>Hello <strong>there</strong></p>" onChange={jest.fn()}/>)
        await waitFor(() => expect(textbox()).toHaveTextContent('Hello there'))
        expect(textbox().querySelector('strong')).toHaveTextContent('there')
    })

    it('follows external value changes without echoing them', async () => {
        const onChange = jest.fn()
        const { rerender } = render(<RichTextEditor id="d" label="Description" value="<p>Draft</p>" onChange={onChange}/>)
        await waitFor(() => expect(textbox()).toHaveTextContent('Draft'))
        rerender(<RichTextEditor id="d" label="Description" value="" onChange={onChange}/>)
        await waitFor(() => expect(textbox()).toHaveTextContent(''))
        expect(onChange).not.toHaveBeenCalled()
    })

    it('shows a labelled formatting toolbar that tracks the active marks', async () => {
        render(<RichTextEditor id="d" label="Description" value="<p>x</p>" onChange={jest.fn()} toolbar/>)
        const toolbar = await screen.findByRole('toolbar', { name: 'Formatting' })
        const bold = screen.getByRole('button', { name: 'Bold' })
        expect(toolbar).toContainElement(bold)
        expect(screen.getByRole('button', { name: 'Italic' })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Underline' })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Bulleted list' })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Numbered list' })).toBeInTheDocument()
        expect(bold).toHaveAttribute('aria-pressed', 'false')
        act(() => { fireEvent.mouseDown(bold) })
        await waitFor(() => expect(bold).toHaveAttribute('aria-pressed', 'true'))
    })

    it('has no toolbar unless asked', async () => {
        render(<RichTextEditor id="d" label="Description" value="" onChange={jest.fn()}/>)
        await waitFor(() => expect(textbox()).toBeInTheDocument())
        expect(screen.queryByRole('toolbar')).not.toBeInTheDocument()
    })
})
