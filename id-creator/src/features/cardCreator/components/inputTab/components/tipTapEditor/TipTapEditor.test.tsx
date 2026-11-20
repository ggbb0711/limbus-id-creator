import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import TipTapEditor from './TipTapEditor'
import { StatusEffectPopupProvider } from 'features/cardCreator/contexts/StatusEffectPopupContext'
import { createCustomEffect } from 'features/cardCreator/types/skills/customEffect/ICustomEffect'
import { customEffectHtml } from 'features/cardCreator/utils/keywords/keywords'

const fanatic = createCustomEffect({ name: 'Fanatic', effect: '<p>Skill Final Power +X</p>' })
const content = `<p>Gain <span data-status-effect="${customEffectHtml(fanatic).replace(/"/g, '&quot;')}">${customEffectHtml(fanatic)}</span> now</p>`

function renderEditor() {
    return render(<StatusEffectPopupProvider skills={[fanatic]}>
        <TipTapEditor inputId="effect" content={content} changeHandler={jest.fn()} matchList={{}}/>
    </StatusEffectPopupProvider>)
}

describe('TipTapEditor status effect popup', () => {
    it('opens the popup when a custom effect in the editor is clicked', async () => {
        const { container } = renderEditor()
        const status = await waitFor(() => {
            const node = container.querySelector('.tiptap-editor-content [data-status-effect]')
            expect(node).not.toBeNull()
            return node!
        })

        fireEvent.click(status)

        expect(screen.getByRole('dialog', { name: 'Fanatic' })).toHaveTextContent('Skill Final Power +X')
    })

    it('closes the popup when typing in the editor', async () => {
        const { container } = renderEditor()
        const status = await waitFor(() => container.querySelector('.tiptap-editor-content [data-status-effect]')!)
        fireEvent.click(status)

        fireEvent.keyDown(container.querySelector('.tiptap-editor-content')!, { key: 'a' })

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('does not open the popup when plain text is clicked', async () => {
        renderEditor()
        const text = await screen.findByText(/now/)

        fireEvent.click(text)

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
})
