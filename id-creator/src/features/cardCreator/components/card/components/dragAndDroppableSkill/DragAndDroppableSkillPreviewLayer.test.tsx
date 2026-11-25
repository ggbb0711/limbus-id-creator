import React from 'react'
import { render, screen } from '@testing-library/react'
import { createOffenseSkill } from 'features/cardCreator/types/skills/offenseSkill/IOffenseSkill'
import { DndItemType } from 'features/cardCreator/constants'
import DragAndDroppableSkillPreviewLayer from './DragAndDroppableSkillPreviewLayer'

let mockLayer: Record<string, unknown> = {}

jest.mock('react-dnd', () => ({
    useDragLayer: () => mockLayer,
}))

jest.mock('../skillCardSection/SkillCardSection', () => ({
    __esModule: true,
    default: () => <p>card skill preview</p>,
}))

const skill = createOffenseSkill()
const offset = { x: 10, y: 20 }

function dragging(itemType: DndItemType) {
    mockLayer = {
        item: { skill, skillWidth: 100, skillHeight: 50 },
        itemType,
        isDragging: true,
        initialCursorOffset: offset,
        initialFileOffset: offset,
        currentFileOffset: offset,
    }
}

describe('DragAndDroppableSkillPreviewLayer', () => {
    it('renders nothing while not dragging', () => {
        mockLayer = { isDragging: false }
        const { container } = render(<DragAndDroppableSkillPreviewLayer/>)
        expect(container).toBeEmptyDOMElement()
    })

    it('shows the card skill while dragging a skill on the card', () => {
        dragging(DndItemType.CardSkill)
        render(<DragAndDroppableSkillPreviewLayer/>)
        expect(screen.getByText('card skill preview')).toBeInTheDocument()
    })

    it('shows the tab icon while dragging a sidebar tab', () => {
        dragging(DndItemType.SkillTab)
        render(<DragAndDroppableSkillPreviewLayer/>)
        expect(screen.queryByText('card skill preview')).not.toBeInTheDocument()
        expect(screen.getByAltText('Offense skill')).toBeInTheDocument()
    })
})
