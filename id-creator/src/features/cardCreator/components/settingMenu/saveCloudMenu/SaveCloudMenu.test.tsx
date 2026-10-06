import { act, fireEvent, render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { makeStore } from 'stores/AppStore'
import SaveCloudMenu from './SaveCloudMenu'

const mockDelete = jest.fn()
const mockUpdate = jest.fn()
const mockPrepare = jest.fn()

jest.mock('hooks/useAuth', () => ({ useAuth: () => ({ user: { id: 'me', userName: 'n', userIcon: '', userEmail: '' }, isInitializing: false }) }))
jest.mock('features/cardCreator/contexts/CardDomRefContext', () => ({ useCardDomRef: () => ({ current: document.createElement('div') }) }))
jest.mock('features/cardCreator/utils/save/prepareCloudSave', () => {
    const actual = jest.requireActual('features/cardCreator/utils/save/prepareCloudSave')
    return { ...actual, prepareCloudSaveForm: (...args: unknown[]) => mockPrepare(...args) }
})
jest.mock('features/cardCreator/api/SaveInfoApi', () => ({
    useGetSaveListQuery: () => ({ data: [{ id: 's1', name: 'My save', saveTime: '2024-01-01T00:00:00', previewImg: '/p.webp' }], isFetching: false, error: undefined }),
    useLazyGetSaveQuery: () => [jest.fn(), { isFetching: false }],
    useCreateSaveMutation: () => [jest.fn()],
    useUpdateSaveMutation: () => [mockUpdate],
    useDeleteSaveMutation: () => [mockDelete, { isLoading: false }],
}))

function setup() {
    const store = makeStore()
    render(<Provider store={store}><SaveCloudMenu saveMode="ID"/></Provider>)
    return store
}

describe('SaveCloudMenu', () => {
    beforeEach(() => {
        mockDelete.mockReset().mockReturnValue({ unwrap: () => Promise.resolve() })
        mockUpdate.mockReset().mockReturnValue({ unwrap: () => Promise.resolve() })
        mockPrepare.mockReset().mockResolvedValue(new FormData())
    })

    it('asks before deleting and only deletes after confirming', async () => {
        setup()
        fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
        expect(screen.getByRole('alertdialog')).toHaveTextContent('Delete the cloud save "My save"?')
        expect(mockDelete).not.toHaveBeenCalled()
        await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Confirm' })) })
        expect(mockDelete).toHaveBeenCalledWith({ saveMode: 'ID', saveId: 's1' })
    })

    it('does nothing when the delete is cancelled', () => {
        setup()
        fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
        fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
        expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
        expect(mockDelete).not.toHaveBeenCalled()
    })

    it('asks before overwriting', async () => {
        setup()
        fireEvent.click(screen.getByRole('button', { name: 'Overwrite' }))
        expect(screen.getByRole('alertdialog')).toHaveTextContent('Overwrite the cloud save "My save"')
        await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Confirm' })) })
        expect(mockUpdate).toHaveBeenCalledWith({ saveMode: 'ID', form: expect.any(FormData) })
    })

    it('names the images that could not be processed', async () => {
        const { SaveImageError } = jest.requireActual('features/cardCreator/utils/save/prepareCloudSave')
        mockPrepare.mockRejectedValue(new SaveImageError(['Skill 3 image'], [new Error('corrupt')]))
        const store = setup()
        fireEvent.click(screen.getByRole('button', { name: 'Overwrite' }))
        await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Confirm' })) })
        expect(store.getState().alert.value[0].msg).toBe("Couldn't process: Skill 3 image. Please check or replace these images.")
        expect(mockUpdate).not.toHaveBeenCalled()
    })

    it('shows the server message when deleting fails', async () => {
        mockDelete.mockReturnValue({ unwrap: () => Promise.reject({ status: 403, data: { message: 'Not your save' } }) })
        const store = setup()
        fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
        await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Confirm' })) })
        expect(store.getState().alert.value[0]).toMatchObject({ status: 'Failure', msg: 'Not your save' })
    })
})
