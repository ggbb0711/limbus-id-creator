import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PostOwnerActions from './PostOwnerActions'

const mockAuth = { user: null as null | { id: string } }
const mockDelete = jest.fn()
const mockPush = jest.fn()
const mockAlert = jest.fn()
const mockRevalidate = jest.fn()

jest.mock('hooks/useAuth', () => ({ useAuth: () => mockAuth }))
jest.mock('hooks/useAddAlert', () => ({ useAddAlert: () => mockAlert }))
jest.mock('next/navigation', () => ({ useRouter: () => ({ push: mockPush }) }))
jest.mock('features/post/api/server/revalidatePost', () => ({ revalidatePost: (...args: unknown[]) => mockRevalidate(...args) }))
jest.mock('features/post/api/PostApi', () => ({ useDeletePostMutation: () => [mockDelete, { isLoading: false }] }))

const renderActions = () => render(<PostOwnerActions postId="p1" userId="author" title="My post" className="card-tag"/>)

beforeEach(() => {
    jest.clearAllMocks()
    mockAuth.user = { id: 'author' }
    mockDelete.mockReturnValue({ unwrap: () => Promise.resolve('p1') })
})

describe('PostOwnerActions', () => {
    it.each([
        ['logged out', null],
        ['another user', { id: 'someone' }],
    ])('renders nothing when %s', (_, user) => {
        mockAuth.user = user
        const { container } = renderActions()
        expect(container).toBeEmptyDOMElement()
    })

    it('links the author to the edit page', () => {
        renderActions()
        expect(screen.getByRole('link', { name: 'Edit' })).toHaveAttribute('href', '/post/p1/edit')
    })

    it('asks before deleting and does nothing on cancel', async () => {
        const user = userEvent.setup()
        renderActions()

        await user.click(screen.getByRole('button', { name: 'Delete' }))
        expect(screen.getByRole('alertdialog')).toHaveTextContent('Delete the post "My post"?')
        await user.click(screen.getByRole('button', { name: 'Cancel' }))

        expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
        expect(mockDelete).not.toHaveBeenCalled()
    })

    it('deletes, refreshes the cached pages and goes to the author page', async () => {
        const user = userEvent.setup()
        renderActions()

        await user.click(screen.getByRole('button', { name: 'Delete' }))
        await user.click(screen.getByRole('button', { name: 'Confirm' }))

        expect(mockDelete).toHaveBeenCalledWith('p1')
        expect(mockRevalidate).toHaveBeenCalledWith('p1', 'author')
        expect(mockAlert).toHaveBeenCalledWith('Success', 'Post deleted')
        expect(mockPush).toHaveBeenCalledWith('/user/author')
    })

    it('shows the error and stays when the delete fails', async () => {
        const user = userEvent.setup()
        mockDelete.mockReturnValue({ unwrap: () => Promise.reject({ status: 403, data: { errorCode: 'RESOURCE_NOT_OWNED' } }) })
        renderActions()

        await user.click(screen.getByRole('button', { name: 'Delete' }))
        await user.click(screen.getByRole('button', { name: 'Confirm' }))

        expect(mockAlert).toHaveBeenCalledWith('Failure', expect.any(String))
        expect(mockRevalidate).not.toHaveBeenCalled()
        expect(mockPush).not.toHaveBeenCalled()
    })
})
