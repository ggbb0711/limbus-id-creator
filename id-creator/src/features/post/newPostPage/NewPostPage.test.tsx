import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { makeStore } from 'stores/AppStore'
import NewPostPage from './NewPostPage'

const mockAuth = { user: null as null | object, isInitializing: true }
jest.mock('hooks/useAuth', () => ({ useAuth: () => mockAuth }))
jest.mock('next/navigation', () => ({ useRouter: () => ({ push: jest.fn() }) }))

const renderPage = () => render(<Provider store={makeStore()}><NewPostPage/></Provider>)

describe('NewPostPage', () => {
    it('shows a spinner instead of the login prompt while auth initialises', () => {
        mockAuth.isInitializing = true
        renderPage()
        expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument()
        expect(screen.queryByText(/Please login to post/)).not.toBeInTheDocument()
    })

    it('asks guests to log in once auth has settled', () => {
        mockAuth.isInitializing = false
        renderPage()
        expect(screen.getByText(/Please login to post/)).toBeInTheDocument()
    })
})
