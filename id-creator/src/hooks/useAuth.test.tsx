import React from 'react'
import { act } from '@testing-library/react'
import { Provider } from 'react-redux'
import { renderToString } from 'react-dom/server'
import { hydrateRoot } from 'react-dom/client'
import { makeStore } from 'stores/AppStore'
import { setCredentials } from 'stores/slices/AuthSlice'
import { useAuth } from './useAuth'

function AccountSlot() {
    const { user, isInitializing } = useAuth()
    if (isInitializing) return null
    return user ? <a href="/new-post">Create new Post</a> : <button>Login to post</button>
}

const loggedIn = () => {
    const store = makeStore()
    store.dispatch(setCredentials({ accessToken: 't', user: { id: 'me', userEmail: '', userName: 'n', userIcon: '' } }))
    return store
}

describe('useAuth hydration', () => {
    it('hydrates without a mismatch when sign-in finished before hydration', async () => {
        const serverHtml = renderToString(<Provider store={makeStore()}><div><AccountSlot/></div></Provider>)
        const container = document.createElement('div')
        container.innerHTML = serverHtml
        document.body.appendChild(container)

        const recoverable = jest.fn()
        const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
        await act(async () => {
            hydrateRoot(container, <Provider store={loggedIn()}><div><AccountSlot/></div></Provider>, { onRecoverableError: recoverable })
        })

        expect(recoverable).not.toHaveBeenCalled()
        expect(consoleError).not.toHaveBeenCalled()
        expect(container.querySelector('a')?.textContent).toBe('Create new Post')
        consoleError.mockRestore()
        container.remove()
    })

    it('reports the real state outside hydration', () => {
        const store = loggedIn()
        const container = document.createElement('div')
        document.body.appendChild(container)
        const { createRoot } = jest.requireActual<typeof import('react-dom/client')>('react-dom/client')
        act(() => { createRoot(container).render(<Provider store={store}><AccountSlot/></Provider>) })
        expect(container.querySelector('a')?.textContent).toBe('Create new Post')
        container.remove()
    })
})
