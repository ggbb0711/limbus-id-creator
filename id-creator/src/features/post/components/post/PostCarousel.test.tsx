import { act, fireEvent, render, renderHook, screen } from '@testing-library/react'
import PostCarousel from './PostCarousel'
import { useCarouselIndex } from 'features/post/hooks/useCarouselIndex'

describe('useCarouselIndex', () => {
    it('stays inside the bounds', () => {
        const { result } = renderHook(() => useCarouselIndex(3))
        expect(result.current).toMatchObject({ index: 0, hasPrev: false, hasNext: true })
        act(() => result.current.prev())
        expect(result.current.index).toBe(0)
        act(() => { result.current.next(); result.current.next(); result.current.next() })
        expect(result.current).toMatchObject({ index: 2, hasPrev: true, hasNext: false })
        act(() => result.current.set(10))
        expect(result.current.index).toBe(2)
    })

    it('handles an empty list', () => {
        const { result } = renderHook(() => useCarouselIndex(0))
        expect(result.current).toMatchObject({ index: 0, hasPrev: false, hasNext: false })
    })
})

describe('PostCarousel', () => {
    beforeAll(() => {
        Object.defineProperty(window, 'ResizeObserver', {
            writable: true,
            value: class { observe() {} unobserve() {} disconnect() {} },
        })
    })

    const images = ['/a.webp', '/b.webp', '/c.webp']

    it('describes each image with the post title', () => {
        render(<PostCarousel images={images} title="My card"/>)
        expect(screen.getByAltText('My card – image 1')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Open image 1 of 3' })).toBeInTheDocument()
    })

    it('moves with buttons', () => {
        render(<PostCarousel images={images} title="T"/>)
        expect(screen.queryByRole('button', { name: 'Previous image' })).not.toBeInTheDocument()
        fireEvent.click(screen.getByRole('button', { name: 'Next image' }))
        expect(screen.getByRole('button', { name: 'Open image 2 of 3' })).not.toHaveClass('hidden')
        expect(screen.getByRole('button', { name: 'Open image 1 of 3', hidden: true })).toHaveClass('hidden')
    })

    it('opens a viewer that navigates with arrows, closes with Escape and returns focus', () => {
        render(<PostCarousel images={images} title="T"/>)
        const trigger = screen.getByRole('button', { name: 'Open image 1 of 3' })
        trigger.focus()
        fireEvent.click(trigger)
        const dialog = screen.getByRole('dialog', { name: 'Image viewer' })
        expect(dialog).toHaveFocus()
        fireEvent.keyDown(dialog, { key: 'ArrowRight' })
        expect(dialog.querySelector('img.image-pop-up')).toHaveAttribute('alt', 'T – image 2')
        fireEvent.keyDown(dialog, { key: 'ArrowLeft' })
        expect(dialog.querySelector('img.image-pop-up')).toHaveAttribute('alt', 'T – image 1')
        fireEvent.keyDown(document, { key: 'Escape' })
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
        expect(trigger).toHaveFocus()
    })
})
