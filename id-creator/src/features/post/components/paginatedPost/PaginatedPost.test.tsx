import { fireEvent, render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { makeStore } from 'stores/AppStore'
import PaginatedPost, { pageCountOf } from './PaginatedPost'
import { IPostDisplayCard } from 'features/post/types/IPostDisplayCard'

const card = (id: string): IPostDisplayCard => ({
    id, title: `Post ${id}`, cardImg: '/a.webp', userIcon: '/u.webp', userName: 'me', userId: 'u', created: '2024-01-01T00:00:00', tags: [], viewCount: 1, commentCount: 2,
})

function setup(props: Partial<React.ComponentProps<typeof PaginatedPost>> = {}) {
    const fetchPost = jest.fn()
    const onRetry = jest.fn()
    const view = render(<Provider store={makeStore()}><PaginatedPost currPage={0} maxCount={0} pageLimit={6} postList={[]} fetchPost={fetchPost} isLoading={false} onRetry={onRetry} {...props}/></Provider>)
    return { fetchPost, onRetry, ...view }
}

beforeAll(() => { Element.prototype.scrollIntoView = jest.fn() })

describe('PaginatedPost', () => {
    it('renders one skeleton per page slot while loading', () => {
        const { container } = setup({ isLoading: true })
        expect(container.querySelectorAll('.post-display-card-loading')).toHaveLength(6)
    })

    it('shows an error with a retry button instead of the empty text', () => {
        const { onRetry } = setup({ error: { status: 500 } })
        expect(screen.getByRole('alert')).toHaveTextContent("Couldn't load posts.")
        expect(screen.queryByText('No posts found :(')).not.toBeInTheDocument()
        fireEvent.click(screen.getByRole('button', { name: 'Retry' }))
        expect(onRetry).toHaveBeenCalled()
    })

    it('shows the empty state', () => {
        setup()
        expect(screen.getByText('No posts found :(')).toBeInTheDocument()
    })

    it('offers the last page when the page is out of range', () => {
        const { fetchPost } = setup({ currPage: 9, maxCount: 13 })
        fireEvent.click(screen.getByRole('button', { name: 'Go to the last page' }))
        expect(fetchPost).toHaveBeenCalledWith(2)
    })

    it('renders posts and two pagination navs', () => {
        setup({ postList: [card('a'), card('b')], maxCount: 2 })
        expect(screen.getByText('Post a')).toBeInTheDocument()
        expect(screen.getAllByRole('navigation', { name: 'Pagination' })).toHaveLength(2)
        expect(screen.getAllByRole('button', { name: 'Share this post' })).toHaveLength(2)
    })

    it('counts pages safely', () => {
        expect(pageCountOf(13, 6)).toBe(3)
        expect(pageCountOf(0, 6)).toBe(0)
        expect(pageCountOf(5, 0)).toBe(5)
    })
})
