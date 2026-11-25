import React from 'react'
import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createOffenseSkill } from 'features/cardCreator/types/skills/offenseSkill/IOffenseSkill'
import { CardLayout } from 'features/cardCreator/constants'
import { SkillActions } from 'features/cardCreator/hooks/useSkillActions'
import { MoveDirection } from 'features/cardCreator/types/SkillActions'
import SkillDetailContainer from './SkillDetailContainer'

jest.mock('../dragAndDroppableSkill/DragAndDroppableSkill', () => ({
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

jest.mock('../skillCardSection/SkillCardSection', () => ({
    __esModule: true,
    default: ({ skill }: { skill: { inputId: string } }) => <p>skill {skill.inputId}</p>,
}))

const SKILL_HEIGHT = 300
let containerHeight = 700
let observers: FakeObserver[] = []

class FakeObserver {
    observed: Element[] = []
    disconnected = false
    constructor(public callback: () => void) { observers.push(this) }
    observe(el: Element) { this.observed.push(el) }
    unobserve() {}
    disconnect() { this.disconnected = true }
}

beforeAll(() => {
    Object.defineProperty(window, 'ResizeObserver', { writable: true, value: FakeObserver })
    jest.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockImplementation(function (this: HTMLElement) {
        return this.classList.contains('skill-detail-container') ? containerHeight : SKILL_HEIGHT
    })
})

beforeEach(() => {
    containerHeight = 700
    observers = []
    onMove.mockReset()
})

const skills = [createOffenseSkill(), createOffenseSkill(), createOffenseSkill()]
const onMove = jest.fn()

function makeSkillActions(): SkillActions {
    return {
        moveSkill: jest.fn(),
        moveSkillBy: jest.fn(),
        deleteSkill: jest.fn(),
        changeSkillType: jest.fn(),
        actionsFor: (index: number) => ({
            type: skills[index].type,
            canMoveUp: index > 0,
            canMoveDown: index < skills.length - 1,
            onChangeType: jest.fn(),
            onMove: (direction: MoveDirection) => onMove(index, direction),
            onDelete: jest.fn(),
        }),
    }
}

function renderContainer(layout: CardLayout = 'Horizontal') {
    return render(<SkillDetailContainer skillDetails={skills} draggingHandler={jest.fn()} changeActiveTab={jest.fn()} skillActions={makeSkillActions()} layout={layout} cardHeight={containerHeight}/>)
}

const container = (root: HTMLElement) => root.querySelector('.skill-detail-container') as HTMLElement

describe('SkillDetailContainer', () => {
    it('sizes the columns from the real container height', () => {
        const { container: root } = renderContainer()
        expect(container(root).style.width).toBe('1025px')
    })

    it('recalculates the columns when the container is resized', () => {
        const { container: root } = renderContainer()
        containerHeight = 1000
        act(() => observers[0].callback())
        expect(container(root).style.width).toBe('700px')
    })

    it('sets an exact width instead of a min-width so the card can shrink', () => {
        const { container: root } = renderContainer()
        expect(container(root).style.minWidth).toBe('')
    })

    it('watches the container and every skill, and stops on unmount', () => {
        const { container: root, unmount } = renderContainer()
        const observer = observers[0]
        expect(observer.observed[0]).toBe(container(root))
        expect(observer.observed).toHaveLength(skills.length + 1)
        unmount()
        expect(observer.disconnected).toBe(true)
    })

    it('leaves vertical layout to wrap in rows without measuring', () => {
        const { container: root } = renderContainer('Vertical')
        expect(container(root)).toHaveClass('vertical')
        expect(container(root).style.minWidth).toBe('')
        expect(container(root).style.width).toBe('')
        expect(observers).toHaveLength(0)
    })

    it('opens the skill actions on right-click without changing the tab', async () => {
        const changeActiveTab = jest.fn()
        render(<SkillDetailContainer skillDetails={skills} draggingHandler={jest.fn()} changeActiveTab={changeActiveTab} skillActions={makeSkillActions()}/>)
        fireEvent.contextMenu(screen.getByText(`skill ${skills[0].inputId}`))
        expect(screen.getByRole('menuitem', { name: 'Move up' })).toHaveAttribute('aria-disabled', 'true')
        await userEvent.click(screen.getByRole('menuitem', { name: 'Move down' }))
        expect(onMove).toHaveBeenCalledWith(0, MoveDirection.Down)
        expect(changeActiveTab).not.toHaveBeenCalled()
    })

    it('opens the skill tab on a normal click', () => {
        const changeActiveTab = jest.fn()
        render(<SkillDetailContainer skillDetails={skills} draggingHandler={jest.fn()} changeActiveTab={changeActiveTab} skillActions={makeSkillActions()}/>)
        fireEvent.click(screen.getByText(`skill ${skills[1].inputId}`))
        expect(changeActiveTab).toHaveBeenCalledWith(1)
    })
})
