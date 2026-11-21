import React from 'react'
import { fireEvent, render, renderHook, screen } from '@testing-library/react'
import ImageViewer from './ImageViewer'
import { useCarouselIndex } from 'hooks/useCarouselIndex'

function Viewer({ images, onClose }: { images: string[], onClose: () => void }) {
    const carousel = useCarouselIndex(images.length)
    return <ImageViewer images={images} title="Card" carousel={carousel} onClose={onClose}/>
}

describe('ImageViewer', () => {
    beforeAll(() => {
        Object.defineProperty(window, 'ResizeObserver', {
            writable: true,
            value: class { observe() {} unobserve() {} disconnect() {} },
        })
    })

    it('shows the current image and moves with the arrow keys', () => {
        render(<Viewer images={['/a.webp', '/b.webp']} onClose={jest.fn()}/>)
        const dialog = screen.getByRole('dialog', { name: 'Image viewer' })

        expect(dialog.querySelector('img.image-pop-up')).toHaveAttribute('src', '/a.webp')
        expect(screen.getByAltText('Card – image 1')).toBeInTheDocument()
        fireEvent.keyDown(dialog, { key: 'ArrowRight' })
        expect(dialog.querySelector('img.image-pop-up')).toHaveAttribute('src', '/b.webp')
        fireEvent.keyDown(dialog, { key: 'ArrowLeft' })
        expect(dialog.querySelector('img.image-pop-up')).toHaveAttribute('src', '/a.webp')
    })

    it('closes with the close button and with Escape', () => {
        const onClose = jest.fn()
        render(<Viewer images={['/a.webp']} onClose={onClose}/>)

        fireEvent.click(screen.getByRole('button', { name: 'Close image viewer' }))
        fireEvent.keyDown(document, { key: 'Escape' })
        expect(onClose).toHaveBeenCalledTimes(2)
    })

    it('has no arrows for a single image', () => {
        const { result } = renderHook(() => useCarouselIndex(1))
        render(<ImageViewer images={['/a.webp']} title="Card" carousel={result.current} onClose={jest.fn()}/>)

        expect(screen.queryByRole('button', { name: 'Previous image' })).not.toBeInTheDocument()
        expect(screen.queryByRole('button', { name: 'Next image' })).not.toBeInTheDocument()
    })
})
