import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import TipTapEditor from './TipTapEditor'
import { StatusEffectPopupProvider } from 'features/cardCreator/contexts/StatusEffectPopupContext'
import { createCustomEffect } from 'features/cardCreator/types/skills/customEffect/ICustomEffect'
import { customEffectHtml, replaceKeywordsAsNodes } from 'features/cardCreator/utils/keywords/keywords'
import { baseStatusEffect } from 'features/cardCreator/utils/keywords/BaseStatusEffect'

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

describe('TipTapEditor paste', () => {
    async function pasteInto(data: Record<string, string>, matchList: Record<string, string> = baseStatusEffect) {
        const changeHandler = jest.fn()
        const { container } = render(<TipTapEditor inputId="effect" content="<p></p>" changeHandler={changeHandler} matchList={matchList}/>)
        const editable = await waitFor(() => container.querySelector('.tiptap')!)
        fireEvent.paste(editable, { clipboardData: { getData: (type: string) => data[type] ?? '', types: Object.keys(data) } })
        return changeHandler.mock.calls.at(-1)?.[0] as string
    }

    it('restores copied status effects as styled nodes', async () => {
        const html = await pasteInto({
            'text/html': replaceKeywordsAsNodes('<p>Inflict 3 [burn]</p>', baseStatusEffect),
            'text/plain': 'Inflict 3 Burn',
        })

        expect(html).toContain('data-status-effect')
        expect(html).toContain('/Images/status-effect/Burn.webp')
    })

    it('pastes unknown status effects as their name', async () => {
        const other = customEffectHtml(createCustomEffect({ name: 'Other Effect' }))
        const html = await pasteInto({ 'text/html': `<p>Gain ${other}</p>`, 'text/plain': 'Gain Other Effect' }, {})

        expect(html).toBe('<p>Gain Other Effect</p>')
    })

    it('keeps plain text pastes as plain text', async () => {
        const html = await pasteInto({ 'text/html': '<p><b>Bold</b> text</p>', 'text/plain': 'Bold text' })

        expect(html).toBe('<p>Bold text</p>')
    })
})
