import { act, fireEvent, render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { makeStore } from 'stores/AppStore'
import { openLoginMenu } from 'stores/slices/UiSlice'
import LoginMenu, { nonOAuthErrorMessage } from './LoginMenu'

type GoogleOptions = { onSuccess: (r: { code: string }) => Promise<void>, onNonOAuthError: (e: { type: string }) => void }
let mockOptions: GoogleOptions
const mockLogin = jest.fn()

jest.mock('@react-oauth/google', () => ({
    GoogleOAuthProvider: ({ children }: { children: React.ReactNode }) => children,
    useGoogleOAuth: () => ({ scriptLoadedSuccessfully: true }),
    useGoogleLogin: (options: GoogleOptions) => {
        mockOptions = options
        return jest.fn()
    },
}))
jest.mock('api/AuthApi', () => ({ useLoginWithGoogleMutation: () => [mockLogin, { isLoading: false }] }))
jest.mock('utils/reportError', () => ({ reportError: jest.fn() }))

function setup() {
    const store = makeStore()
    store.dispatch(openLoginMenu())
    render(<Provider store={store}><LoginMenu/></Provider>)
    return store
}

describe('LoginMenu', () => {
    beforeEach(() => mockLogin.mockReset())

    it('logs in once with the code and closes the menu', async () => {
        mockLogin.mockReturnValue({ unwrap: () => Promise.resolve({}) })
        const store = setup()
        expect(screen.getByRole('dialog', { name: 'Login' })).toBeInTheDocument()
        await act(() => mockOptions.onSuccess({ code: 'abc' }))
        expect(mockLogin).toHaveBeenCalledTimes(1)
        expect(mockLogin).toHaveBeenCalledWith('"abc"')
        expect(store.getState().ui.isLoginMenuActive).toBe(false)
        expect(store.getState().alert.value[0]).toMatchObject({ status: 'Success' })
    })

    it('keeps the menu open and alerts when the backend rejects the login', async () => {
        mockLogin.mockReturnValue({ unwrap: () => Promise.reject({ status: 'FETCH_ERROR' }) })
        const store = setup()
        await act(() => mockOptions.onSuccess({ code: 'abc' }))
        expect(store.getState().ui.isLoginMenuActive).toBe(true)
        expect(store.getState().alert.value[0]).toMatchObject({ status: 'Failure' })
    })

    it('explains a closed or blocked sign-in window', () => {
        const store = setup()
        act(() => mockOptions.onNonOAuthError({ type: 'popup_closed' }))
        expect(store.getState().alert.value[0].msg).toBe('Sign-in window was closed')
        expect(nonOAuthErrorMessage({ type: 'popup_failed_to_open' })).toBe("Couldn't open the Google sign-in window")
    })

    it('closes from the close button', () => {
        const store = setup()
        fireEvent.click(screen.getByRole('button', { name: 'Close' }))
        expect(store.getState().ui.isLoginMenuActive).toBe(false)
    })
})
