import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { createOffenseSkill } from 'features/cardCreator/types/skills/offenseSkill/IOffenseSkill'
import { createPassiveSkill } from 'features/cardCreator/types/skills/passiveSkill/IPassiveSkill'
import { DndItemType } from 'features/cardCreator/constants'
import { SkillDetail } from 'features/cardCreator/types/SkillDetail'
import InputTabSide from './InputTabSide'

interface DragSpec { type: string, item: { skill: SkillDetail } }
interface DropSpec { accept: string, drop: (item: { skill: SkillDetail }) => void }

const mockDragSpecs: DragSpec[] = []
const mockDropSpecs: DropSpec[] = []

jest.mock('react-dnd', () => ({
    useDrag: (factory: () => DragSpec) => {
        mockDragSpecs.push(factory())
        return [{ isDragging: false }, (node: unknown) => node]
    },
    useDrop: (factory: () => DropSpec) => {
        mockDropSpecs.push(factory())
        return [{ isOver: false }, (node: unknown) => node]
    },
}))

const skills = [createOffenseSkill(), createPassiveSkill(), createOffenseSkill()]

function setup() {
    mockDragSpecs.length = 0
    mockDropSpecs.length = 0
    const moveSkill = jest.fn()
    const changeTab = jest.fn()
    render(<InputTabSide sinnerIcon="/icon.webp" skillDetails={skills} changeTab={changeTab} activeTab={0}
        addTab={jest.fn()} resetBtnHandler={jest.fn()} moveSkill={moveSkill}/>)
    return { moveSkill, changeTab }
}

describe('InputTabSide', () => {
    it('makes every skill tab draggable but not the card info tab', () => {
        setup()
        expect(mockDragSpecs).toHaveLength(skills.length)
        expect(mockDragSpecs.map(spec => spec.item.skill.inputId)).toEqual(skills.map(skill => skill.inputId))
        expect(mockDragSpecs.every(spec => spec.type === DndItemType.SkillTab)).toBe(true)
        expect(mockDropSpecs.every(spec => spec.accept === DndItemType.SkillTab)).toBe(true)
    })

    it('moves the dropped skill onto the target tab', () => {
        const { moveSkill } = setup()
        mockDropSpecs[2].drop({ skill: skills[0] })
        expect(moveSkill).toHaveBeenCalledWith(skills[0].inputId, skills[2].inputId)
    })

    it('still opens a tab on click', () => {
        const { changeTab } = setup()
        fireEvent.click(screen.getByAltText('Passive skill'))
        expect(changeTab).toHaveBeenCalledWith(1)
        fireEvent.click(screen.getByAltText('Card info'))
        expect(changeTab).toHaveBeenCalledWith(-1)
    })
})
