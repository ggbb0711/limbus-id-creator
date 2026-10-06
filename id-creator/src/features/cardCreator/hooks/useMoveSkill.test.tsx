import React from 'react'
import { Provider } from 'react-redux'
import { act, renderHook } from '@testing-library/react'
import { makeStore } from 'stores/AppStore'
import CardEditorContext from 'features/cardCreator/editors/CardEditorContext'
import { egoEditor } from 'features/cardCreator/editors/egoEditor'
import { useMoveSkill } from './useMoveSkill'

function setup() {
    const store = makeStore()
    const changeActiveTab = jest.fn()
    const wrapper = ({ children }: { children: React.ReactNode }) =>
        <Provider store={store}><CardEditorContext.Provider value={egoEditor}>{children}</CardEditorContext.Provider></Provider>
    const { result } = renderHook(() => useMoveSkill(changeActiveTab), { wrapper })
    const ids = () => store.getState().egoInfo.value.skillDetails.map(skill => skill.inputId)
    return { store, changeActiveTab, result, ids }
}

describe('useMoveSkill', () => {
    it('moves the skill in the current card and follows it with the active tab', () => {
        const { result, ids, changeActiveTab } = setup()
        const [a, b, c] = ids()
        act(() => result.current(a, c))
        expect(ids()).toEqual([b, c, a])
        const update = changeActiveTab.mock.calls[0][0] as (i: number) => number
        expect(update(0)).toBe(2)
        expect(update(-2)).toBe(-2)
    })

    it('does nothing for an unknown id', () => {
        const { result, ids, changeActiveTab } = setup()
        const before = ids()
        act(() => result.current(before[0], 'missing'))
        expect(ids()).toEqual(before)
        expect(changeActiveTab).not.toHaveBeenCalled()
    })
})
