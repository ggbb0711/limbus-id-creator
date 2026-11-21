import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import PostCardsView from './PostCardsView'

jest.mock('features/post/components/post/PostCarousel', () => ({
    __esModule: true,
    default: ({ carousel }: { carousel: { index: number } }) => <p>carousel at {carousel.index}</p>,
}))

const twoCards = () => render(<PostCardsView images={['a', 'b']} title="Post" summaries={[<p key="a">First card</p>, <p key="b">Second card</p>]}/>)

describe('PostCardsView', () => {
    it('keeps every summary in the page and shows the one for the current image', () => {
        twoCards()

        expect(screen.getByText('First card')).toBeVisible()
        expect(screen.getByText('Second card')).not.toBeVisible()
        expect(screen.getByText('carousel at 0')).toBeInTheDocument()
    })

    it('moves the summary and the carousel together with the side buttons', () => {
        twoCards()
        expect(screen.getByRole('button', { name: 'Previous ID/EGO' })).toBeDisabled()

        fireEvent.click(screen.getByRole('button', { name: 'Next ID/EGO' }))

        expect(screen.getByText('Second card')).toBeVisible()
        expect(screen.getByText('First card')).not.toBeVisible()
        expect(screen.getByText('carousel at 1')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Next ID/EGO' })).toBeDisabled()

        fireEvent.click(screen.getByRole('button', { name: 'Previous ID/EGO' }))

        expect(screen.getByText('First card')).toBeVisible()
    })

    it('shows the position at the top and the bottom', () => {
        twoCards()

        expect(screen.getAllByText('1 / 2')).toHaveLength(2)

        fireEvent.click(screen.getByRole('button', { name: 'Next ID/EGO' }))

        expect(screen.getAllByText('2 / 2')).toHaveLength(2)
    })

    it('hides the side buttons and the position for a single image', () => {
        render(<PostCardsView images={['a']} title="Post" summaries={[<p key="a">Only card</p>]}/>)

        expect(screen.queryByRole('button', { name: 'Next ID/EGO' })).not.toBeInTheDocument()
        expect(screen.queryByRole('button', { name: 'Previous ID/EGO' })).not.toBeInTheDocument()
        expect(screen.queryByText('1 / 1')).not.toBeInTheDocument()
    })

    it('navigates plain images when no image has a summary', () => {
        render(<PostCardsView images={['a', 'b']} title="Post" summaries={[null, null]}/>)

        fireEvent.click(screen.getByRole('button', { name: 'Next ID/EGO' }))

        expect(screen.getByText('carousel at 1')).toBeInTheDocument()
        expect(screen.getAllByText('2 / 2')).toHaveLength(2)
    })
})
