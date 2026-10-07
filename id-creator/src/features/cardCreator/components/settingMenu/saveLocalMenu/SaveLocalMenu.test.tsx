import React from 'react'
import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { Provider } from 'react-redux'
import { makeStore } from 'stores/AppStore'
import { appConfig } from 'config/env.client'
import CardEditorContext from 'features/cardCreator/editors/CardEditorContext'
import { idEditor } from 'features/cardCreator/editors/idEditor'
import { createIdInfo } from 'features/cardCreator/types/IIdInfo'
import type { LocalSave } from 'features/cardCreator/hooks/useSaveLocal'
import { SaveLocalMenu } from './SaveLocalMenu'

const hook = {
    saveData: [] as LocalSave[],
    isLoading: false,
    createSave: jest.fn(),
    deleteSave: jest.fn(),
    changeSaveName: jest.fn(),
    overwriteSave: jest.fn(),
    loadSave: jest.fn(),
}
jest.mock('features/cardCreator/hooks/useSaveLocal', () => ({ __esModule: true, default: () => hook }))

const makeSave = (id: string, updateTime: string): LocalSave => ({
    id, name: `Save ${id}`, saveTime: updateTime, updateTime, previewImg: '', saveInfo: createIdInfo({ title: `title ${id}` }),
})

function setup(saves: LocalSave[] = [makeSave('a', '2024-01-01T00:00:00Z'), makeSave('b', '2024-02-01T00:00:00Z')]) {
    hook.saveData = saves
    const close = jest.fn()
    const store = makeStore()
    render(<Provider store={store}><CardEditorContext.Provider value={idEditor}><SaveLocalMenu close={close}/></CardEditorContext.Provider></Provider>)
    return { store, close }
}

const tab = (name: string) => screen.getByText(name).closest('.save-tab') as HTMLElement

describe('SaveLocalMenu', () => {
    beforeEach(() => {
        Object.values(hook).forEach(value => typeof value === 'function' && (value as jest.Mock).mockReset())
        hook.createSave.mockResolvedValue(true)
        hook.deleteSave.mockResolvedValue(true)
        hook.changeSaveName.mockResolvedValue(true)
        hook.overwriteSave.mockResolvedValue(true)
    })

    it('lists saves newest first with a counter', () => {
        setup()
        const names = screen.getAllByText(/^Save [ab]$/).map(el => el.textContent)
        expect(names).toEqual(['Save b', 'Save a'])
        expect(screen.getByText(`Current local save: 2/${appConfig.limits.card.localSaveMaxLen}`)).toBeInTheDocument()
    })

    it('asks before deleting and only deletes after confirming', () => {
        setup()
        fireEvent.click(within(tab('Save a')).getByRole('button', { name: 'Delete' }))
        expect(hook.deleteSave).not.toHaveBeenCalled()
        fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))
        expect(hook.deleteSave).toHaveBeenCalledWith('a')
    })

    it('does not delete when cancelled', () => {
        setup()
        fireEvent.click(within(tab('Save a')).getByRole('button', { name: 'Delete' }))
        fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
        expect(hook.deleteSave).not.toHaveBeenCalled()
        expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
    })

    it('asks before overwriting with the current card', () => {
        const { store } = setup()
        fireEvent.click(within(tab('Save b')).getByRole('button', { name: 'Overwrite' }))
        expect(hook.overwriteSave).not.toHaveBeenCalled()
        fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))
        expect(hook.overwriteSave).toHaveBeenCalledWith('b', idEditor.selectInfo(store.getState()))
    })

    it('renames a save through an accessible button', () => {
        setup()
        fireEvent.click(screen.getByRole('button', { name: 'Rename Save a' }))
        const input = screen.getByLabelText('Enter the name of the save:') as HTMLInputElement
        expect(input.value).toBe('Save a')
        fireEvent.change(input, { target: { value: 'Renamed' } })
        fireEvent.click(screen.getByRole('button', { name: 'Update' }))
        expect(hook.changeSaveName).toHaveBeenCalledWith('a', 'Renamed')
    })

    it('creates a save with the chosen name', () => {
        setup()
        fireEvent.click(screen.getByRole('button', { name: 'Create a new save' }))
        fireEvent.change(screen.getByLabelText('Enter the name of the save:'), { target: { value: 'Fresh' } })
        fireEvent.click(screen.getByRole('button', { name: 'Create' }))
        expect(hook.createSave).toHaveBeenCalledWith(expect.objectContaining({ name: 'Fresh' }))
    })

    it('disables creating at the save limit', () => {
        const saves = Array.from({ length: appConfig.limits.card.localSaveMaxLen }, (_, i) => makeSave(String(i), '2024-01-01T00:00:00Z'))
        setup(saves)
        expect(screen.getByRole('button', { name: 'Create a new save' })).toBeDisabled()
    })

    it('loads a save into the editor and closes the menu', async () => {
        hook.loadSave.mockResolvedValue(makeSave('a', '2024-01-01T00:00:00Z'))
        const { store, close } = setup()
        await act(async () => { fireEvent.click(within(tab('Save a')).getByRole('button', { name: 'Load' })) })
        expect(idEditor.selectInfo(store.getState()).title).toBe('title a')
        expect(close).toHaveBeenCalled()
    })

    it('stays open when a save cannot be loaded', async () => {
        hook.loadSave.mockResolvedValue(null)
        const { close } = setup()
        await act(async () => { fireEvent.click(within(tab('Save a')).getByRole('button', { name: 'Load' })) })
        expect(close).not.toHaveBeenCalled()
    })
})
