import { act, render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { makeStore } from 'stores/AppStore'
import { closeLoginMenu, openLoginMenu } from 'stores/slices/UiSlice'
import LoginMenuHost from './LoginMenuHost'

jest.mock('./LoginMenu', () => ({ __esModule: true, default: () => <p>google login menu</p> }))

describe('LoginMenuHost', () => {
    it('only loads the login menu after it is first opened, then keeps it', async () => {
        const store = makeStore()
        render(<Provider store={store}><LoginMenuHost/></Provider>)
        expect(screen.queryByText('google login menu')).not.toBeInTheDocument()
        act(() => { store.dispatch(openLoginMenu()) })
        expect(await screen.findByText('google login menu')).toBeInTheDocument()
        act(() => { store.dispatch(closeLoginMenu()) })
        expect(screen.getByText('google login menu')).toBeInTheDocument()
    })
})
