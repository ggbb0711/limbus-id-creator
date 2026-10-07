import { fireEvent, render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { makeStore } from 'stores/AppStore'
import CardEditorContext from 'features/cardCreator/editors/CardEditorContext'
import { CARD_EDITORS } from 'features/cardCreator/editors/cardEditors'
import { CardKind } from 'features/cardCreator/editors/CardEditorDefinition'
import { SINNERS } from 'features/cardCreator/constants'
import SinnerIconPicker from './SinnerIconPicker'

function setup(kind: CardKind) {
    const store = makeStore()
    const view = render(
        <Provider store={store}>
            <CardEditorContext.Provider value={CARD_EDITORS[kind]}>
                <SinnerIconPicker/>
            </CardEditorContext.Provider>
        </Provider>
    )
    return { store, ...view }
}

describe('SinnerIconPicker', () => {
    it('renders all 12 sinners and marks the current one active', () => {
        const { container } = setup('id')
        expect(container.querySelectorAll('img.sinner-icon')).toHaveLength(12)
        expect(screen.getByAltText('Yi_Sang_Icon.webp')).toHaveClass('active')
    })

    it('updates the icon and colour of the id card', () => {
        const { store } = setup('id')
        const faust = SINNERS.find(s => s.alt === 'Faust_Icon.webp')
        fireEvent.click(screen.getByAltText('Faust_Icon.webp'))
        expect(store.getState().idInfo.value).toMatchObject({ sinnerIcon: faust?.src, sinnerColor: 'var(--Faust-color)' })
        expect(screen.getByAltText('Faust_Icon.webp')).toHaveClass('active')
    })

    it('uses the ego class prefix and slice in ego mode', () => {
        const { store, container } = setup('ego')
        expect(container.querySelector('.sinner-ego-icon-container')).toBeInTheDocument()
        fireEvent.click(screen.getByAltText('Gregor_Icon.webp'))
        expect(store.getState().egoInfo.value.sinnerColor).toBe('var(--Gregor-color)')
        expect(store.getState().idInfo.value.sinnerColor).toBe('var(--Yi-Sang-color)')
    })
})
