import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import PostCardsView from './PostCardsView'

jest.mock('features/post/components/post/PostCarousel', () => ({
    __esModule: true,
    default: ({ carousel }: { carousel: { index: number } }) => <p>carousel at {carousel.index}</p>,
}))

describe('PostCardsView', () => {
    it('keeps every summary in the page and shows the one for the current image', () => {
        render(<PostCardsView images={['a', 'b']} title="Post" summaries={[<p key="a">First card</p>, <p key="b">Second card</p>]}/>)

        expect(screen.getByText('First card')).toBeVisible()
        expect(screen.getByText('Second card')).not.toBeVisible()
        expect(screen.getByText('carousel at 0')).toBeInTheDocument()
    })

    it('moves the summary and the carousel together', () => {
        render(<PostCardsView images={['a', 'b']} title="Post" summaries={[<p key="a">First card</p>, <p key="b">Second card</p>]}/>)

        fireEvent.click(screen.getByRole('button', { name: 'Next ID/EGO' }))

        expect(screen.getByText('Second card')).toBeVisible()
        expect(screen.getByText('First card')).not.toBeVisible()
        expect(screen.getByText('carousel at 1')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Next ID/EGO' })).toBeDisabled()
    })

    it('hides the arrows for a single image', () => {
        render(<PostCardsView images={['a']} title="Post" summaries={[<p key="a">Only card</p>]}/>)

        expect(screen.queryByRole('button', { name: 'Next ID/EGO' })).not.toBeInTheDocument()
    })
})
