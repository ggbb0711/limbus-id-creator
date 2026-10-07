import React from 'react'
import { Provider } from 'react-redux'
import { act, renderHook } from '@testing-library/react'
import { makeStore } from 'stores/AppStore'
import CardEditorContext from 'features/cardCreator/editors/CardEditorContext'
import { idEditor } from 'features/cardCreator/editors/idEditor'
import { createCustomEffect } from 'features/cardCreator/types/skills/customEffect/ICustomEffect'
import { baseStatusEffect } from 'features/cardCreator/utils/keywords/BaseStatusEffect'
import { saveCustomKeywords } from 'features/cardCreator/utils/keywords/customKeywordStorage'
import { useStatusEffect } from './useStatusEffect'

function setup() {
    const store = makeStore()
    const wrapper = ({ children }: { children: React.ReactNode }) =>
        <Provider store={store}><CardEditorContext.Provider value={idEditor}>{children}</CardEditorContext.Provider></Provider>
    const { result } = renderHook(() => useStatusEffect(), { wrapper })
    return { store, result }
}

describe('useStatusEffect', () => {
    beforeEach(() => localStorage.clear())

    it('includes the base status effects', () => {
        const { result } = setup()
        const [key] = Object.keys(baseStatusEffect)
        expect(result.current[key]).toBe(baseStatusEffect[key])
    })

    it('includes custom keywords saved before mounting', () => {
        saveCustomKeywords([{ customKeywordID: 'a', keyword: 'My Word', color: '#ff0000' }])
        const { result } = setup()
        expect(result.current.my_word).toContain('My Word')
    })

    it('updates when custom keywords are saved while mounted', () => {
        const { result } = setup()
        expect(result.current.late_word).toBeUndefined()
        act(() => saveCustomKeywords([{ customKeywordID: 'b', keyword: 'Late Word', color: '' }]))
        expect(result.current.late_word).toContain('Late Word')
    })

    it('includes custom effects defined by the card skills', () => {
        const { store, result } = setup()
        act(() => { store.dispatch(idEditor.skillActions.addSkill(createCustomEffect({ name: 'Glow' }))) })
        expect(result.current.glow).toContain('Glow')
    })

    it('keeps the same object while nothing changes', () => {
        const { store, result } = setup()
        const first = result.current
        act(() => { store.dispatch(idEditor.updateBaseField('title', 'Unrelated')) })
        expect(result.current).toBe(first)
    })

    it('ignores corrupt stored keywords', () => {
        localStorage.setItem('customKeywords', '{broken')
        const { result } = setup()
        expect(Object.keys(result.current)).toEqual(Object.keys(baseStatusEffect))
    })
})
