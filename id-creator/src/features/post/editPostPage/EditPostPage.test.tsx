import React from 'react'
import { render, screen } from '@testing-library/react'
import EditPostPage from './EditPostPage'

const mockAuth = { user: null as null | { id: string }, isInitializing: false }
const mockQuery = { data: undefined as unknown, error: undefined as unknown, isLoading: false }
const mockReplace = jest.fn()

jest.mock('hooks/useAuth', () => ({ useAuth: () => mockAuth }))
jest.mock('next/navigation', () => ({ useRouter: () => ({ replace: mockReplace }) }))
jest.mock('features/post/api/PostApi', () => ({ useGetPostQuery: () => mockQuery }))
jest.mock('features/post/newPostPage/NewPostPage', () => ({
    __esModule: true,
    default: ({ post }: { post: { title: string } }) => <p>editing {post.title}</p>,
}))

beforeEach(() => {
    jest.clearAllMocks()
    mockAuth.user = { id: 'author' }
    mockAuth.isInitializing = false
    mockQuery.data = { id: 'p1', userId: 'author', title: 'My post' }
    mockQuery.error = undefined
    mockQuery.isLoading = false
})

describe('EditPostPage', () => {
    it('renders the edit form for the author', () => {
        render(<EditPostPage postId="p1"/>)
        expect(screen.getByText('editing My post')).toBeInTheDocument()
        expect(mockReplace).not.toHaveBeenCalled()
    })

    it.each([
        ['another user', { id: 'someone' }],
        ['a guest', null],
    ])('sends %s back to the post', (_, user) => {
        mockAuth.user = user
        render(<EditPostPage postId="p1"/>)
        expect(mockReplace).toHaveBeenCalledWith('/post/p1')
        expect(screen.queryByText(/editing/)).not.toBeInTheDocument()
    })

    it('waits for auth before redirecting', () => {
        mockAuth.user = null
        mockAuth.isInitializing = true
        render(<EditPostPage postId="p1"/>)
        expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument()
        expect(mockReplace).not.toHaveBeenCalled()
    })

    it('shows the API error when the post cannot be loaded', () => {
        mockQuery.data = undefined
        mockQuery.error = { status: 410, data: { errorCode: 'POST_REMOVED' } }
        render(<EditPostPage postId="p1"/>)
        expect(screen.getByRole('alert')).toHaveTextContent('This post has been deleted by its author')
    })
})
