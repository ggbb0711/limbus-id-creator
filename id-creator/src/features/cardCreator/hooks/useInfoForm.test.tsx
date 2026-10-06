import React from 'react'
import { Provider } from 'react-redux'
import { act, renderHook } from '@testing-library/react'
import { makeStore } from 'stores/AppStore'
import CardEditorContext from 'features/cardCreator/editors/CardEditorContext'
import { idEditor } from 'features/cardCreator/editors/idEditor'
import { createIdInfo } from 'features/cardCreator/types/IIdInfo'
import { IIdInfo } from 'features/cardCreator/types/IIdInfo'
import { useInfoForm } from './useInfoForm'

const resetSpy = jest.fn()
jest.mock('react-hook-form', () => {
    const actual = jest.requireActual('react-hook-form')
    return {
        ...actual,
        useForm: (props: object) => {
            const form = actual.useForm(props)
            if (!form.reset.isSpied) {
                const original = form.reset
                form.reset = Object.assign((...args: unknown[]) => { resetSpy(...args); return original(...args) }, { isSpied: true })
            }
            return form
        },
    }
})

beforeEach(() => resetSpy.mockClear())

function setup() {
    const store = makeStore()
    const wrapper = ({ children }: { children: React.ReactNode }) =>
        <Provider store={store}><CardEditorContext.Provider value={idEditor}>{children}</CardEditorContext.Provider></Provider>
    const { result } = renderHook(() => useInfoForm<IIdInfo>(), { wrapper })
    const info = () => store.getState().idInfo.value
    return { store, result, info }
}

describe('useInfoForm', () => {
    it('starts with the stored card', () => {
        const { result, info } = setup()
        expect(result.current.getValues()).toEqual(info())
    })

    it('pushes form edits to the store', () => {
        const { result, info } = setup()
        act(() => result.current.setValue('title', 'Typed'))
        expect(info().title).toBe('Typed')
    })

    it('does not reset the form after its own edits', () => {
        const { result } = setup()
        act(() => result.current.setValue('title', 'Typed'))
        act(() => result.current.setValue('name', 'Name'))
        expect(resetSpy).not.toHaveBeenCalled()
        expect(result.current.getValues()).toMatchObject({ title: 'Typed', name: 'Name' })
    })

    it('resets the form when the card is loaded from elsewhere', () => {
        const { store, result } = setup()
        act(() => { store.dispatch(idEditor.load(createIdInfo({ title: 'Loaded' }))) })
        expect(result.current.getValues('title')).toBe('Loaded')
        expect(resetSpy).toHaveBeenCalledTimes(1)
    })

    it('picks up field updates made outside the form', () => {
        const { store, result } = setup()
        act(() => { store.dispatch(idEditor.updateBaseField('sinnerColor', '#123456')) })
        expect(result.current.getValues('sinnerColor')).toBe('#123456')
    })

    it('does not share objects with the store', () => {
        const { result, info } = setup()
        expect(result.current.getValues('splashArtTranslation')).not.toBe(info().splashArtTranslation)
    })
})
