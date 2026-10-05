import 'fake-indexeddb/auto'
import { act, renderHook, waitFor } from '@testing-library/react'
import { createIdInfo } from 'features/cardCreator/types/IIdInfo'
import { indexDB } from 'features/cardCreator/utils/save/indexDB'
import useSaveLocal, { LocalSave } from './useSaveLocal'

const addAlert = jest.fn()
jest.mock('hooks/useAlert', () => ({ __esModule: true, default: () => ({ alertArr: [], addAlert }) }))
jest.mock('@sentry/nextjs', () => ({ captureException: jest.fn() }))

const makeSave = (id: string, name = id): LocalSave => ({
    id, name, saveTime: '2024-01-01', updateTime: '2024-01-01', previewImg: '', saveInfo: createIdInfo({ title: id }),
})

const renderReady = async () => {
    const hook = renderHook(() => useSaveLocal('ID'))
    await waitFor(() => expect(hook.result.current.isLoading).toBe(false))
    return hook
}

describe('useSaveLocal', () => {
    beforeEach(async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {})
        addAlert.mockClear()
        await indexDB.IdLocalSaves.clear()
    })

    afterEach(() => jest.restoreAllMocks())

    it('loads and migrates existing saves', async () => {
        await indexDB.IdLocalSaves.put({ id: 'old', saveName: 'Legacy', saveInfo: { title: 'x' } } as unknown as LocalSave)
        const { result } = renderHook(() => useSaveLocal('ID'))
        await waitFor(() => expect(result.current.saveData).toHaveLength(1))
        expect(result.current.saveData[0].name).toBe('Legacy')
        expect(result.current.saveData[0].saveInfo.title).toBe('x')
    })

    it('creates, renames, overwrites and deletes a save', async () => {
        const { result } = await renderReady()

        await act(async () => expect(await result.current.createSave(makeSave('a'))).toBe(true))
        expect(result.current.saveData.map(save => save.id)).toEqual(['a'])

        await act(async () => expect(await result.current.changeSaveName('a', 'Renamed')).toBe(true))
        expect(result.current.saveData[0].name).toBe('Renamed')
        expect((await indexDB.IdLocalSaves.get('a'))?.name).toBe('Renamed')

        await act(async () => expect(await result.current.overwriteSave('a', createIdInfo({ title: 'New' }))).toBe(true))
        expect(result.current.saveData[0].saveInfo.title).toBe('New')
        expect((await indexDB.IdLocalSaves.get('a'))?.saveInfo.title).toBe('New')

        await act(async () => expect(await result.current.deleteSave('a')).toBe(true))
        expect(result.current.saveData).toEqual([])
        expect(await indexDB.IdLocalSaves.count()).toBe(0)
    })

    it('loads a single migrated save', async () => {
        await indexDB.IdLocalSaves.put(makeSave('b'))
        const { result } = await renderReady()
        let loaded: LocalSave | null = null
        await act(async () => { loaded = await result.current.loadSave('b') })
        expect(loaded?.saveInfo.title).toBe('b')
    })

    it('returns null for a missing save', async () => {
        const { result } = await renderReady()
        let loaded: LocalSave | null = makeSave('x')
        await act(async () => { loaded = await result.current.loadSave('missing') })
        expect(loaded).toBeNull()
    })

    it('alerts and returns false when a write fails', async () => {
        const { result } = await renderReady()
        jest.spyOn(indexDB.IdLocalSaves, 'add').mockRejectedValueOnce(new Error('quota'))
        await act(async () => expect(await result.current.createSave(makeSave('c'))).toBe(false))
        expect(result.current.saveData).toEqual([])
        expect(addAlert).toHaveBeenCalledWith('Failure', 'Could not create the save')
    })

    it('alerts when the initial read fails', async () => {
        jest.spyOn(indexDB.IdLocalSaves, 'toArray').mockRejectedValueOnce(new Error('blocked'))
        renderHook(() => useSaveLocal('ID'))
        await waitFor(() => expect(addAlert).toHaveBeenCalledWith('Failure', 'Could not read your local saves'))
    })
})
