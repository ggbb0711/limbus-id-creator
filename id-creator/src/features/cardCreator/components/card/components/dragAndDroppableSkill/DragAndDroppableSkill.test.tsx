import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { createOffenseSkill } from 'features/cardCreator/types/skills/offenseSkill/IOffenseSkill'
import DragAndDroppableSkill from './DragAndDroppableSkill'

jest.mock('react-dnd', () => {
    const connect = (node: unknown) => node
    const dragState = { isDragging: false }
    const dropState = { isOver: false }
    return {
        useDrag: () => [dragState, connect],
        useDrop: () => [dropState, connect],
    }
})

function setup() {
    const isDraggingHandler = jest.fn()
    render(<>
        <DragAndDroppableSkill skill={createOffenseSkill()} isDraggingHandler={isDraggingHandler} dropHandler={jest.fn()}>
            <p>skill</p>
        </DragAndDroppableSkill>
        <p>elsewhere</p>
    </>)
    isDraggingHandler.mockClear()
    return { isDraggingHandler }
}

describe('DragAndDroppableSkill', () => {
    it('ignores a right-click so card panning keeps working', () => {
        const { isDraggingHandler } = setup()
        fireEvent.mouseDown(screen.getByText('skill'), { button: 2 })
        expect(isDraggingHandler).not.toHaveBeenCalledWith(true)
    })

    it('pauses panning while the left button is held on the skill', () => {
        const { isDraggingHandler } = setup()
        fireEvent.mouseDown(screen.getByText('skill'), { button: 0 })
        expect(isDraggingHandler).toHaveBeenLastCalledWith(true)
        fireEvent.mouseUp(screen.getByText('skill'), { button: 0 })
        expect(isDraggingHandler).toHaveBeenLastCalledWith(false)
    })

    it('resumes panning when the button is released somewhere else', () => {
        const { isDraggingHandler } = setup()
        fireEvent.mouseDown(screen.getByText('skill'), { button: 0 })
        fireEvent.mouseUp(screen.getByText('elsewhere'), { button: 0 })
        expect(isDraggingHandler).toHaveBeenLastCalledWith(false)
    })
})
