import React from 'react'
import { act, render } from '@testing-library/react'
import { createOffenseSkill } from 'features/cardCreator/types/skills/offenseSkill/IOffenseSkill'
import { CardLayout } from 'features/cardCreator/constants'
import SkillDetailContainer from './SkillDetailContainer'

jest.mock('../dragAndDroppableSkill/DragAndDroppableSkill', () => ({
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

jest.mock('../skillCardSection/SkillCardSection', () => ({
    __esModule: true,
    default: () => <p>skill</p>,
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
})

const skills = [createOffenseSkill(), createOffenseSkill(), createOffenseSkill()]

function renderContainer(layout: CardLayout = 'Horizontal') {
    return render(<SkillDetailContainer skillDetails={skills} draggingHandler={jest.fn()} changeActiveTab={jest.fn()} moveSkill={jest.fn()} layout={layout} cardHeight={containerHeight}/>)
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
})
