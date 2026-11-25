import React, { Dispatch, SetStateAction } from 'react'
import { Provider } from 'react-redux'
import { act, renderHook } from '@testing-library/react'
import { makeStore } from 'stores/AppStore'
import CardEditorContext from 'features/cardCreator/editors/CardEditorContext'
import { egoEditor } from 'features/cardCreator/editors/egoEditor'
import { ActiveTabContext } from 'features/cardCreator/contexts/ActiveTabContext'
import { MoveDirection } from 'features/cardCreator/types/SkillActions'
import { useSkillActions } from './useSkillActions'

function setup(activeTab = 0) {
    const store = makeStore()
    let tab = activeTab
    const setActiveTab: Dispatch<SetStateAction<number>> = jest.fn(update => {
        tab = typeof update === 'function' ? update(tab) : update
    })
    const wrapper = ({ children }: { children: React.ReactNode }) =>
        <Provider store={store}>
            <CardEditorContext.Provider value={egoEditor}>
                <ActiveTabContext.Provider value={setActiveTab}>{children}</ActiveTabContext.Provider>
            </CardEditorContext.Provider>
        </Provider>
    const { result } = renderHook(() => useSkillActions(), { wrapper })
    const skills = () => store.getState().egoInfo.value.skillDetails
    const ids = () => skills().map(skill => skill.inputId)
    return { result, ids, skills, activeTab: () => tab, setActiveTab }
}

describe('useSkillActions', () => {
    describe('moveSkill', () => {
        it('moves the skill and follows it when its tab is open', () => {
            const { result, ids, activeTab } = setup(0)
            const [a, b, c] = ids()
            act(() => result.current.moveSkill(a, c))
            expect(ids()).toEqual([b, c, a])
            expect(activeTab()).toBe(2)
        })

        it('keeps another open skill open at its new index', () => {
            const { result, ids, activeTab } = setup(1)
            const [a, b, c] = ids()
            act(() => result.current.moveSkill(a, c))
            expect(ids()[activeTab()]).toBe(b)
        })

        it('leaves the stats tab and a collapsed panel alone', () => {
            for (const tab of [-1, -2]) {
                const { result, ids, activeTab } = setup(tab)
                const [a, , c] = ids()
                act(() => result.current.moveSkill(a, c))
                expect(activeTab()).toBe(tab)
            }
        })

        it('does nothing for an unknown id', () => {
            const { result, ids, setActiveTab } = setup()
            const before = ids()
            act(() => result.current.moveSkill(before[0], 'missing'))
            expect(ids()).toEqual(before)
            expect(setActiveTab).not.toHaveBeenCalled()
        })
    })

    describe('moveSkillBy', () => {
        it('swaps the skill with the one above or below it', () => {
            const { result, ids } = setup()
            const [a, b, c] = ids()
            act(() => result.current.moveSkillBy(b, MoveDirection.Up))
            expect(ids()).toEqual([b, a, c])
            act(() => result.current.moveSkillBy(b, MoveDirection.Down))
            expect(ids()).toEqual([a, b, c])
        })

        it('does nothing past either end', () => {
            const { result, ids } = setup()
            const before = ids()
            act(() => result.current.moveSkillBy(before[0], MoveDirection.Up))
            act(() => result.current.moveSkillBy(before[2], MoveDirection.Down))
            expect(ids()).toEqual(before)
        })
    })

    describe('deleteSkill', () => {
        it('keeps the open skill open when a skill before it is deleted', () => {
            const { result, ids, activeTab } = setup(2)
            const [a, , c] = ids()
            act(() => result.current.deleteSkill(a))
            expect(ids()).not.toContain(a)
            expect(ids()[activeTab()]).toBe(c)
        })

        it('opens the next skill when the open one is deleted', () => {
            const { result, ids, activeTab } = setup(1)
            const [, b, c] = ids()
            act(() => result.current.deleteSkill(b))
            expect(ids()[activeTab()]).toBe(c)
        })

        it('opens the previous skill when the last open one is deleted', () => {
            const { result, ids, activeTab } = setup(2)
            const [, b, c] = ids()
            act(() => result.current.deleteSkill(c))
            expect(ids()[activeTab()]).toBe(b)
        })

        it('falls back to the stats tab when no skills are left', () => {
            const { result, ids, activeTab } = setup(0)
            for (const id of ids()) act(() => result.current.deleteSkill(id))
            expect(ids()).toEqual([])
            expect(activeTab()).toBe(-1)
        })
    })

    it('changes the type of a skill in place', () => {
        const { result, ids, skills } = setup()
        const [, b] = ids()
        act(() => result.current.changeSkillType(b, 'PassiveSkill'))
        expect(skills()[1].type).toBe('PassiveSkill')
        expect(skills()).toHaveLength(3)
    })

    it('builds menu actions for a skill index', () => {
        const { result, ids, skills } = setup()
        const first = result.current.actionsFor(0)
        const last = result.current.actionsFor(2)
        expect(first.type).toBe(skills()[0].type)
        expect(first.canMoveUp).toBe(false)
        expect(first.canMoveDown).toBe(true)
        expect(last.canMoveDown).toBe(false)
        const [a, b] = ids()
        act(() => first.onMove(MoveDirection.Down))
        expect(ids().slice(0, 2)).toEqual([b, a])
    })
})
