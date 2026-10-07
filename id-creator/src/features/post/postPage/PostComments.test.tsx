import React from 'react'
import { render, screen } from '@testing-library/react'
import PostComments from './PostComments'
import { IComment } from 'features/post/types/IComment'

const mockQuery = jest.fn()
jest.mock('features/post/api/CommentApi', () => ({
    useGetCommentsQuery: (...args: unknown[]) => mockQuery(...args),
    useCreateCommentMutation: () => [jest.fn()],
}))
jest.mock('hooks/useAuth', () => ({ useAuth: () => ({ user: null, isInitializing: true }) }))
jest.mock('hooks/useAddAlert', () => ({ useAddAlert: () => jest.fn() }))
jest.mock('components/loginMenu/LoginPromptButton', () => ({ __esModule: true, default: () => null }))

const comment = (content: string): IComment => ({
    userId: 'u', userName: 'n', userIcon: '/u.webp', postId: 'p', content: `<p>${content}</p>`, created: '2024-01-01T00:00:00',
}) as IComment

describe('PostComments', () => {
    beforeAll(() => {
        Object.assign(global, { IntersectionObserver: class { observe() {} disconnect() {} unobserve() {} } })
    })

    it('shows the server-rendered comments before the query resolves', () => {
        mockQuery.mockReturnValue({ data: undefined, isFetching: true, error: undefined, refetch: jest.fn() })
        render(<PostComments postId="p" initialComments={[comment('From server')]}/>)
        expect(screen.getByText('From server')).toBeInTheDocument()
    })

    it('prefers the fetched comments once they arrive', () => {
        mockQuery.mockReturnValue({ data: { list: [comment('From client')], hasMore: false }, isFetching: false, error: undefined, refetch: jest.fn() })
        render(<PostComments postId="p" initialComments={[comment('From server')]}/>)
        expect(screen.getByText('From client')).toBeInTheDocument()
        expect(screen.queryByText('From server')).not.toBeInTheDocument()
    })

    it('renders without initial comments', () => {
        mockQuery.mockReturnValue({ data: undefined, isFetching: true, error: undefined, refetch: jest.fn() })
        render(<PostComments postId="p"/>)
        expect(screen.queryByText('From server')).not.toBeInTheDocument()
    })
})
