import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { makeStore } from 'stores/AppStore'
import CardEditorContext from 'features/cardCreator/editors/CardEditorContext'
import { CardEditorDefinition } from 'features/cardCreator/editors/CardEditorDefinition'
import { egoEditor } from 'features/cardCreator/editors/egoEditor'
import { idEditor } from 'features/cardCreator/editors/idEditor'
import InfoStatPage from '../InfoStatPage'

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

describe('CardStylingSection', () => {
    it.each([idEditor, egoEditor])('shows the layout options and size sliders for %s.kind', (editor) => {
        renderPage(editor)
        expect(screen.getByRole('button', { name: 'Card Styling' })).toBeInTheDocument()
        expect(screen.getByRole('radio', { name: 'Horizontal' })).toBeChecked()
        expect(screen.getByRole('radio', { name: 'Vertical' })).not.toBeChecked()
        expect(screen.getByRole('slider', { name: /Card width/ })).toHaveValue('1440')
        expect(screen.getByRole('slider', { name: /Card height/ })).toHaveValue('1000')
    })

    it.each([idEditor, egoEditor])('switches the layout in the store for %s.kind', (editor) => {
        const store = renderPage(editor)
        fireEvent.click(screen.getByRole('radio', { name: 'Vertical' }))
        expect(editor.selectInfo(store.getState()).cardLayout).toBe('Vertical')
        fireEvent.click(screen.getByRole('radio', { name: 'Horizontal' }))
        expect(editor.selectInfo(store.getState()).cardLayout).toBe('Horizontal')
    })

    it.each([idEditor, egoEditor])('only lets the height change in horizontal layout for %s.kind', (editor) => {
        const store = renderPage(editor)
        const width = screen.getByRole('slider', { name: /Card width/ })
        const height = screen.getByRole('slider', { name: /Card height/ })
        expect(width).toBeDisabled()
        expect(height).toBeEnabled()
        expect(screen.getByText('Width follows the skills in horizontal layout.')).toBeInTheDocument()
        fireEvent.change(height, { target: { value: '1200' } })
        expect(editor.selectInfo(store.getState()).cardHeight).toBe(1200)
        expect(screen.getByText('1200px')).toBeInTheDocument()
    })

    it.each([idEditor, egoEditor])('only lets the width change in vertical layout for %s.kind', (editor) => {
        const store = renderPage(editor)
        fireEvent.click(screen.getByRole('radio', { name: 'Vertical' }))
        const width = screen.getByRole('slider', { name: /Card width/ })
        const height = screen.getByRole('slider', { name: /Card height/ })
        expect(width).toBeEnabled()
        expect(height).toBeDisabled()
        expect(screen.getByText('Height follows the skills in vertical layout.')).toBeInTheDocument()
        fireEvent.change(width, { target: { value: '1800' } })
        expect(editor.selectInfo(store.getState()).cardWidth).toBe(1800)
    })

    it('keeps the shared size when switching layouts', () => {
        const store = renderPage(idEditor)
        fireEvent.change(screen.getByRole('slider', { name: /Card height/ }), { target: { value: '1300' } })
        fireEvent.click(screen.getByRole('radio', { name: 'Vertical' }))
        fireEvent.change(screen.getByRole('slider', { name: /Card width/ }), { target: { value: '3000' } })
        fireEvent.click(screen.getByRole('radio', { name: 'Horizontal' }))
        expect(idEditor.selectInfo(store.getState())).toMatchObject({ cardLayout: 'Horizontal', cardWidth: 3000, cardHeight: 1300 })
    })
})
