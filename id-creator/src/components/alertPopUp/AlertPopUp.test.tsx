import { act, fireEvent, render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { makeStore } from 'stores/AppStore'
import { addAlertReducer } from 'stores/slices/AlertSlice'
import AlertPopUp from './AlertPopUp'

function setup() {
    const store = makeStore()
    render(<Provider store={store}><AlertPopUp/></Provider>)
    return store
}

describe('AlertPopUp', () => {
    it('is a polite live region', () => {
        setup()
        const region = screen.getByRole('status')
        expect(region).toHaveAttribute('aria-live', 'polite')
    })

    it('announces failures assertively', () => {
        const store = setup()
        act(() => { store.dispatch(addAlertReducer('Failure', 'Broken')) })
        expect(screen.getByRole('alert')).toHaveTextContent('Broken')
    })

    it('dismisses an alert with a focusable button', () => {
        const store = setup()
        act(() => { store.dispatch(addAlertReducer('Success', 'Saved')) })
        const dismiss = screen.getByRole('button', { name: 'Dismiss' })
        dismiss.focus()
        expect(dismiss).toHaveFocus()
        fireEvent.click(dismiss)
        expect(screen.queryByText('Saved')).not.toBeInTheDocument()
        expect(store.getState().alert.value).toEqual([])
    })
})
