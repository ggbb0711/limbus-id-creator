import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import PostCarousel from './PostCarousel'
import { useCarouselIndex } from 'hooks/useCarouselIndex'

function Carousel({ images, title }: { images: string[], title: string }) {
    const carousel = useCarouselIndex(images.length)
    return <>
        <button type="button" onClick={carousel.next}>outside next</button>
        <PostCarousel images={images} title={title} carousel={carousel}/>
    </>
}

describe('PostCarousel', () => {
    beforeAll(() => {
        Object.defineProperty(window, 'ResizeObserver', {
            writable: true,
            value: class { observe() {} unobserve() {} disconnect() {} },
        })
    })

    const images = ['/a.webp', '/b.webp', '/c.webp']

    it('describes each image with the post title and has no arrows of its own', () => {
        render(<Carousel images={images} title="My card"/>)
        expect(screen.getByAltText('My card – image 1')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Open image 1 of 3' })).toBeInTheDocument()
        expect(screen.queryByRole('button', { name: 'Previous image' })).not.toBeInTheDocument()
        expect(screen.queryByRole('button', { name: 'Next image' })).not.toBeInTheDocument()
    })

    it('shows the image picked by the shared carousel', () => {
        render(<Carousel images={images} title="T"/>)
        fireEvent.click(screen.getByRole('button', { name: 'outside next' }))
        expect(screen.getByRole('button', { name: 'Open image 2 of 3' })).not.toHaveClass('hidden')
        expect(screen.getByRole('button', { name: 'Open image 1 of 3', hidden: true })).toHaveClass('hidden')
    })

    it('opens a viewer that navigates with arrows, closes with Escape and returns focus', () => {
        render(<Carousel images={images} title="T"/>)
        const trigger = screen.getByRole('button', { name: 'Open image 1 of 3' })
        trigger.focus()
        fireEvent.click(trigger)
        const dialog = screen.getByRole('dialog', { name: 'Image viewer' })
        expect(dialog).toHaveFocus()
        expect(screen.getByRole('button', { name: 'Next image' })).toBeInTheDocument()
        fireEvent.keyDown(dialog, { key: 'ArrowRight' })
        expect(dialog.querySelector('img.image-pop-up')).toHaveAttribute('alt', 'T – image 2')
        fireEvent.keyDown(dialog, { key: 'ArrowLeft' })
        expect(dialog.querySelector('img.image-pop-up')).toHaveAttribute('alt', 'T – image 1')
        fireEvent.keyDown(document, { key: 'Escape' })
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
        expect(trigger).toHaveFocus()
    })
})
