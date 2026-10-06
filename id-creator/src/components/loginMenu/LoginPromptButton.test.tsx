import { fireEvent, render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { makeStore } from 'stores/AppStore'
import LoginPromptButton from './LoginPromptButton'

describe('LoginPromptButton', () => {
    it('opens the login menu', () => {
        const store = makeStore()
        const onClick = jest.fn()
        render(<Provider store={store}><LoginPromptButton className="main-button nav-button" onClick={onClick}>Login to post</LoginPromptButton></Provider>)
        const button = screen.getByRole('button', { name: 'Login to post' })
        expect(button).toHaveClass('nav-button')
        fireEvent.click(button)
        expect(store.getState().ui.isLoginMenuActive).toBe(true)
        expect(onClick).toHaveBeenCalled()
    })

    it('defaults to a plain Login button', () => {
        render(<Provider store={makeStore()}><LoginPromptButton/></Provider>)
        expect(screen.getByRole('button', { name: 'Login' })).toHaveClass('main-button')
    })
})
