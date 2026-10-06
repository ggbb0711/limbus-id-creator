import { fireEvent, render, screen } from '@testing-library/react'
import { CommentContainer } from './Comment'

let visible = true
const observers: { disconnect: jest.Mock }[] = []

class MockIntersectionObserver {
    disconnect = jest.fn()
    constructor(private callback: IntersectionObserverCallback) {
        observers.push(this)
    }
    observe() {
        this.callback([{ isIntersecting: visible } as IntersectionObserverEntry], this as unknown as IntersectionObserver)
    }
    unobserve() {}
    takeRecords() { return [] }
}

beforeAll(() => { Object.defineProperty(window, 'IntersectionObserver', { writable: true, value: MockIntersectionObserver }) })
beforeEach(() => { visible = true; observers.length = 0 })

describe('CommentContainer', () => {
    it('loads again when the sentinel is still visible after a page loads', () => {
        const loadMore = jest.fn()
        const { rerender } = render(<CommentContainer comments={[]} loadMore={loadMore} isLoading={false} hasMore/>)
        expect(loadMore).toHaveBeenCalledTimes(1)
        rerender(<CommentContainer comments={[]} loadMore={loadMore} isLoading hasMore/>)
        expect(observers[0].disconnect).toHaveBeenCalled()
        rerender(<CommentContainer comments={[]} loadMore={loadMore} isLoading={false} hasMore/>)
        expect(loadMore).toHaveBeenCalledTimes(2)
    })

    it('starts observing when hasMore turns on later', () => {
        const loadMore = jest.fn()
        const { rerender } = render(<CommentContainer comments={[]} loadMore={loadMore} isLoading={false} hasMore={false}/>)
        expect(loadMore).not.toHaveBeenCalled()
        rerender(<CommentContainer comments={[]} loadMore={loadMore} isLoading={false} hasMore/>)
        expect(loadMore).toHaveBeenCalledTimes(1)
    })

    it('does not load while the sentinel is off screen', () => {
        visible = false
        const loadMore = jest.fn()
        render(<CommentContainer comments={[]} loadMore={loadMore} isLoading={false} hasMore/>)
        expect(loadMore).not.toHaveBeenCalled()
    })

    it('shows an error with retry and stops loading', () => {
        const loadMore = jest.fn()
        const onRetry = jest.fn()
        render(<CommentContainer comments={[]} loadMore={loadMore} isLoading={false} hasMore error={{ status: 500 }} onRetry={onRetry}/>)
        expect(screen.getByRole('alert')).toHaveTextContent("Couldn't load comments.")
        expect(loadMore).not.toHaveBeenCalled()
        fireEvent.click(screen.getByRole('button', { name: 'Retry' }))
        expect(onRetry).toHaveBeenCalled()
    })

    it('renders comment HTML in a div', () => {
        const { container } = render(<CommentContainer comments={[{ userId: 'u', userName: 'n', userIcon: '/u.webp', postId: 'p', content: '<p>Hi</p>', created: '2024-01-01T00:00:00' }]} loadMore={jest.fn()} isLoading={false} hasMore={false}/>)
        expect(container.querySelector('div.description-txt > p')).toHaveTextContent('Hi')
    })

    it('strips script handlers from comment html but keeps the text', () => {
        const { container } = render(<CommentContainer comments={[{ userId: 'u', userName: 'n', userIcon: '/u.webp', postId: 'p', content: '<img src=x onerror="alert(1)">Hi <a href="javascript:alert(1)">there</a>', created: '2024-01-01T00:00:00' }]} loadMore={jest.fn()} isLoading={false} hasMore={false}/>)
        const body = container.querySelector('.description-txt') as HTMLElement
        expect(body.querySelector('[onerror]')).toBeNull()
        expect(body.querySelector('a')?.getAttribute('href')).toBeFalsy()
        expect(body.textContent).toBe('Hi there')
    })
})
