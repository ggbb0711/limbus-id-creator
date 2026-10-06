import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { makeStore } from 'stores/AppStore'
import UserPage from './UserPage'

jest.mock('next/navigation', () => ({
    useRouter: () => ({ push: jest.fn() }),
    usePathname: () => '/user/u1',
    useSearchParams: () => new URLSearchParams('page=2'),
}))
jest.mock('features/user/api/UserApi', () => ({
    useGetUserQuery: () => ({ data: undefined, isFetching: true, isLoading: true }),
    useUpdateUserMutation: () => [jest.fn(), { isLoading: false }],
}))
const mockUsePaginatedPosts = jest.fn()
jest.mock('features/post/hooks/usePaginatedPosts', () => ({ usePaginatedPosts: (...args: unknown[]) => mockUsePaginatedPosts(...args) }))

describe('UserPage', () => {
    beforeAll(() => { Element.prototype.scrollIntoView = jest.fn() })

    it('renders the server-provided profile on the first render, not a spinner', () => {
        mockUsePaginatedPosts.mockReturnValue({ postList: [], maxCount: 0, pageSize: 10, isLoading: true, error: undefined, refetch: jest.fn() })
        render(<Provider store={makeStore()}><UserPage initialUser={{ id: 'u1', userName: 'Faust', userIcon: '/f.webp', createdAt: '2024-01-01T00:00:00', owned: false }}/></Provider>)
        expect(screen.getByText('Faust')).toBeInTheDocument()
        expect(screen.queryByText(/Fetching user/)).not.toBeInTheDocument()
        expect(screen.getByAltText("Faust's avatar")).toBeInTheDocument()
    })

    it('reads the posts page from the URL', () => {
        expect(mockUsePaginatedPosts).toHaveBeenCalledWith(2, { userId: 'u1' })
    })
})
