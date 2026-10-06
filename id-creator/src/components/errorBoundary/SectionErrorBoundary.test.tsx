import React, { useState } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import SectionErrorBoundary from './SectionErrorBoundary'
import { reportError } from 'utils/reportError'

jest.mock('utils/reportError', () => ({ reportError: jest.fn() }))

let shouldThrow = true

function Flaky() {
    if (shouldThrow) throw new Error('boom')
    return <p>Comments loaded</p>
}

function Page() {
    const [count] = useState(0)
    return <div>
        <p>Rest of the page {count}</p>
        <SectionErrorBoundary context="comments" label="comments"><Flaky/></SectionErrorBoundary>
    </div>
}

describe('SectionErrorBoundary', () => {
    beforeEach(() => {
        shouldThrow = true
        jest.spyOn(console, 'error').mockImplementation(() => {})
    })

    afterEach(() => jest.restoreAllMocks())

    it('contains a crash to its section and reports it', () => {
        render(<Page/>)
        expect(screen.getByText('Rest of the page 0')).toBeInTheDocument()
        expect(screen.getByRole('alert')).toHaveTextContent("The comments couldn't be displayed.")
        expect(reportError).toHaveBeenCalledWith(expect.objectContaining({ message: 'boom' }), expect.objectContaining({ context: 'boundary:comments' }))
    })

    it('retries the section', () => {
        render(<Page/>)
        shouldThrow = false
        fireEvent.click(screen.getByRole('button', { name: 'Try again' }))
        expect(screen.getByText('Comments loaded')).toBeInTheDocument()
    })
})
