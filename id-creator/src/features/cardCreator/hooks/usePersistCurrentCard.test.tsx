import 'fake-indexeddb/auto'
import React from 'react'
import { Provider } from 'react-redux'
import { act, renderHook, waitFor } from '@testing-library/react'
import { makeStore } from 'stores/AppStore'
import { idInfoSlice } from 'features/cardCreator/stores/IdInfoSlice'
import { createEgoInfo } from 'features/cardCreator/types/IEgoInfo'
import { createIdInfo } from 'features/cardCreator/types/IIdInfo'
import { indexDB } from 'features/cardCreator/utils/save/indexDB'
import { usePersistCurrentCard } from './usePersistCurrentCard'
import { CARD_EDITORS } from 'features/cardCreator/editors/cardEditors'
import { CardKind } from 'features/cardCreator/editors/CardEditorDefinition'

jest.mock('@sentry/nextjs', () => ({ captureException: jest.fn() }))
jest.mock('config/env.client', () => {
    const actual = jest.requireActual('config/env.client')
    return { ...actual, appConfig: { ...actual.appConfig, timing: { ...actual.appConfig.timing, autosaveDebounceMs: 20 } } }
})

const setup = (kind: CardKind) => {
    const store = makeStore()
    const wrapper = ({ children }: { children: React.ReactNode }) => <Provider store={store}>{children}</Provider>
    const hook = renderHook(() => usePersistCurrentCard(CARD_EDITORS[kind]), { wrapper })
    return { store, ...hook }
}

describe('usePersistCurrentCard', () => {
    beforeEach(async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {})
        await indexDB.currIdSave.clear()
        await indexDB.currEgoSave.clear()
    })

    afterEach(() => jest.restoreAllMocks())

    it('restores the saved card and sets the save mode', async () => {
        await indexDB.currEgoSave.put({ ...createEgoInfo({ title: 'Saved ego' }), localSaveId: 1 })
        const { store, result } = setup('ego')
        await waitFor(() => expect(result.current).toBe(true))
        expect(store.getState().egoInfo.value.title).toBe('Saved ego')
        expect(store.getState().egoInfo.loadId).toBe(1)
        expect(store.getState().settingMenu.settingMenuSaveMode).toBe('EGO')
    })

    it('migrates legacy data on restore', async () => {
        await indexDB.currIdSave.put({ title: 'Legacy', sinnerIcon: 'Images/sinner-icon/Faust.png', localSaveId: 1 } as never)
        const { store, result } = setup('id')
        await waitFor(() => expect(result.current).toBe(true))
        expect(store.getState().idInfo.value.sinnerIcon).toBe('/Images/sinner-icon/Faust.webp')
    })

    it('still marks itself restored when the read fails', async () => {
        jest.spyOn(indexDB.currIdSave, 'get').mockRejectedValueOnce(new Error('blocked'))
        const { store, result } = setup('id')
        await waitFor(() => expect(result.current).toBe(true))
        expect(store.getState().idInfo.loadId).toBe(0)
        expect(store.getState().settingMenu.settingMenuSaveMode).toBe('ID')
    })

    it('debounces autosave to the latest value', async () => {
        const { store, result } = setup('id')
        await waitFor(() => expect(result.current).toBe(true))
        const put = jest.spyOn(indexDB.currIdSave, 'put')
        act(() => {
            store.dispatch(idInfoSlice.actions.setInfo(createIdInfo({ title: 'one' })))
            store.dispatch(idInfoSlice.actions.setInfo(createIdInfo({ title: 'two' })))
        })
        await act(() => new Promise(resolve => setTimeout(resolve, 0)))
        store.dispatch(idInfoSlice.actions.setInfo(createIdInfo({ title: 'three' })))
        await waitFor(async () => expect((await indexDB.currIdSave.get(1))?.title).toBe('three'))
        expect(put).toHaveBeenCalledTimes(1)
        expect(put).toHaveBeenLastCalledWith(expect.objectContaining({ title: 'three', localSaveId: 1 }))
    })
})
