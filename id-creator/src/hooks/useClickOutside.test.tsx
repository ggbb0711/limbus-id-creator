import React, { useRef } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { useClickOutside } from './useClickOutside'

function Harness({ active, onOutside }: { active: boolean, onOutside: () => void }) {
    const first = useRef<HTMLDivElement>(null)
    const second = useRef<HTMLButtonElement>(null)
    useClickOutside([first, second], active, onOutside)
    return <>
        <div ref={first}><span>inside</span></div>
        <button ref={second}>trigger</button>
        <p>outside</p>
    </>
}

describe('useClickOutside', () => {
    it('calls the handler for a press outside every ref', () => {
        const onOutside = jest.fn()
        render(<Harness active onOutside={onOutside}/>)
        fireEvent.mouseDown(screen.getByText('outside'))
        expect(onOutside).toHaveBeenCalledTimes(1)
    })

    it('ignores presses inside any ref, including descendants', () => {
        const onOutside = jest.fn()
        render(<Harness active onOutside={onOutside}/>)
        fireEvent.mouseDown(screen.getByText('inside'))
        fireEvent.mouseDown(screen.getByText('trigger'))
        expect(onOutside).not.toHaveBeenCalled()
    })

    it('does nothing while inactive', () => {
        const onOutside = jest.fn()
        render(<Harness active={false} onOutside={onOutside}/>)
        fireEvent.mouseDown(screen.getByText('outside'))
        expect(onOutside).not.toHaveBeenCalled()
    })

    it('uses the latest handler without resubscribing', () => {
        const first = jest.fn()
        const second = jest.fn()
        const { rerender } = render(<Harness active onOutside={first}/>)
        rerender(<Harness active onOutside={second}/>)
        fireEvent.mouseDown(screen.getByText('outside'))
        expect(first).not.toHaveBeenCalled()
        expect(second).toHaveBeenCalledTimes(1)
    })

    it('stops listening after unmount', () => {
        const onOutside = jest.fn()
        const { unmount } = render(<Harness active onOutside={onOutside}/>)
        unmount()
        fireEvent.mouseDown(document.body)
        expect(onOutside).not.toHaveBeenCalled()
    })
})
