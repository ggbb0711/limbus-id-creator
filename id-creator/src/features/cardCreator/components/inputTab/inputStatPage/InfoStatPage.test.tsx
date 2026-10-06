import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { filesize } from 'filesize'
import { makeStore } from 'stores/AppStore'
import CardEditorContext from 'features/cardCreator/editors/CardEditorContext'
import { CardEditorDefinition } from 'features/cardCreator/editors/CardEditorDefinition'
import { egoEditor } from 'features/cardCreator/editors/egoEditor'
import { idEditor } from 'features/cardCreator/editors/idEditor'
import InfoStatPage from './InfoStatPage'

beforeAll(() => {
    Object.defineProperty(window, 'ResizeObserver', { writable: true, value: class { observe() {} unobserve() {} disconnect() {} } })
    jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
})

function renderPage(editor: CardEditorDefinition) {
    const store = makeStore()
    render(
        <Provider store={store}>
            <CardEditorContext.Provider value={editor}>
                <InfoStatPage collapsePage={jest.fn()}/>
            </CardEditorContext.Provider>
        </Provider>
    )
    return store
}

describe('InfoStatPage', () => {
    it.each([idEditor, egoEditor])('shows the shared general fields for %s.kind', (editor) => {
        renderPage(editor)
        expect(screen.getByRole('button', { name: editor.generalSectionTitle })).toBeInTheDocument()
        expect(screen.getByLabelText(/Title/)).toBeInTheDocument()
        expect(screen.getByLabelText(/^Name/)).toBeInTheDocument()
        expect(screen.getByText(`Upload sinner icon (<= ${filesize(editor.uploadLimits.sinnerIcon)})`)).toBeInTheDocument()
        expect(screen.getByText(`Upload splash art (<= ${filesize(editor.uploadLimits.splashArt)})`)).toBeInTheDocument()
    })

    it('adds the identity fields for the id editor', () => {
        renderPage(idEditor)
        expect(screen.getByText('Pick the sinner rarity:')).toBeInTheDocument()
        expect(screen.getByLabelText(/Traits/)).toBeInTheDocument()
        expect(screen.getByLabelText(/Health/)).toBeInTheDocument()
        expect(screen.queryByRole('combobox', { name: 'Ego level' })).not.toBeInTheDocument()
    })

    it('adds the E.G.O fields for the ego editor', () => {
        renderPage(egoEditor)
        expect(screen.getByRole('combobox', { name: 'Ego level' })).toBeInTheDocument()
        expect(screen.getByLabelText(/Sanity cost/)).toBeInTheDocument()
        expect(screen.queryByText('Pick the sinner rarity:')).not.toBeInTheDocument()
        expect(screen.queryByLabelText(/Health/)).not.toBeInTheDocument()
    })

    it.each([idEditor, egoEditor])('writes the title to the right card for %s.kind', (editor) => {
        const store = renderPage(editor)
        fireEvent.change(screen.getByLabelText(/Title/), { target: { value: 'Blade Lineage' } })
        expect(editor.selectInfo(store.getState()).title).toBe('Blade Lineage')
        const other = editor === idEditor ? egoEditor : idEditor
        expect(other.selectInfo(store.getState()).title).toBe('')
    })
})
