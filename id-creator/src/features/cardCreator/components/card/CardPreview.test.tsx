import React from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { makeStore } from 'stores/AppStore'
import CardEditorContext from 'features/cardCreator/editors/CardEditorContext'
import { CardEditorDefinition } from 'features/cardCreator/editors/CardEditorDefinition'
import { egoEditor } from 'features/cardCreator/editors/egoEditor'
import { idEditor } from 'features/cardCreator/editors/idEditor'
import CardPreview from './CardPreview'

jest.mock('react-dnd', () => {
    const connect = (node: unknown) => node
    const dragState = { isDragging: false }
    const dropState = { isOver: false }
    return {
        useDrag: () => [dragState, connect],
        useDrop: () => [dropState, connect],
    }
})

beforeAll(() => {
    Object.defineProperty(window, 'ResizeObserver', { writable: true, value: class { observe() {} unobserve() {} disconnect() {} } })
})

function renderPreview(editor: CardEditorDefinition, store = makeStore()) {
    return render(
        <Provider store={store}>
            <CardEditorContext.Provider value={editor}>
                <CardPreview changeActiveTab={jest.fn()}/>
            </CardEditorContext.Provider>
        </Provider>
    )
}

describe('CardPreview', () => {
    it('renders the shared shell for both editors', () => {
        for (const editor of [idEditor, egoEditor]) {
            const { container, unmount } = renderPreview(editor)
            expect(container.querySelector('.Card .sinner-icon-background')).toBeInTheDocument()
            expect(container.querySelector('.Card-container .skill-detail-container')).toBeInTheDocument()
            unmount()
        }
    })

    it('renders the identity body for the id editor', () => {
        const { container } = renderPreview(idEditor)
        expect(container.querySelector('.sinner-stats')).toBeInTheDocument()
        expect(container.querySelector('.sin-cost-container')).toBeNull()
    })

    it('renders the E.G.O body for the ego editor', () => {
        const { container } = renderPreview(egoEditor)
        expect(container.querySelector('.sin-cost-container')).toBeInTheDocument()
        expect(container.querySelector('.sin-resistant-container')).toBeInTheDocument()
        expect(container.querySelector('.sinner-stats')).toBeNull()
    })

    it.each([idEditor, egoEditor])('sizes a horizontal card by its height for %s.kind', (editor) => {
        const store = makeStore()
        store.dispatch(editor.setInfo({ ...editor.selectInfo(store.getState()), cardHeight: 1200, cardWidth: 3000 }))
        const { container } = renderPreview(editor, store)
        const card = container.querySelector('.Card') as HTMLElement
        expect(card).toHaveClass('horizontal')
        expect(card.style.height).toBe('1200px')
        expect(card.style.width).toBe('')
        expect(container.querySelector('.skill-detail-container')).not.toHaveClass('vertical')
    })

    it.each([idEditor, egoEditor])('sizes a vertical card by its width and moves the sinner icon for %s.kind', (editor) => {
        const store = makeStore()
        store.dispatch(editor.setInfo({ ...editor.selectInfo(store.getState()), cardLayout: 'Vertical', cardHeight: 1200, cardWidth: 3000 }))
        const { container } = renderPreview(editor, store)
        const card = container.querySelector('.Card') as HTMLElement
        expect(card).toHaveClass('vertical')
        expect(card.style.width).toBe('3000px')
        expect(card.style.height).toBe('')
        expect(container.querySelector('.Card > .sinner-icon-background')).toBeNull()
        expect(container.querySelector('.vertical-sinner-icon')).toBeInTheDocument()
        expect(container.querySelector('.skill-detail-container')).toHaveClass('vertical')
    })
})
