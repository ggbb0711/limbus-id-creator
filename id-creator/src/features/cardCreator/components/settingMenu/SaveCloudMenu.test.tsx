import { act, fireEvent, render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { makeStore } from 'stores/AppStore'
import SaveCloudMenu from './SaveCloudMenu'
import { appConfig } from 'config/env.client'
import CardEditorContext from 'features/cardCreator/editors/CardEditorContext'
import { idEditor } from 'features/cardCreator/editors/idEditor'

const mockDelete = jest.fn()
const mockUpdate = jest.fn()
const mockPrepare = jest.fn()
const mockListQuery = jest.fn()

jest.mock('hooks/useAuth', () => ({ useAuth: () => ({ user: { id: 'me', userName: 'n', userIcon: '', userEmail: '' }, isInitializing: false }) }))
jest.mock('features/cardCreator/contexts/CardDomRefContext', () => ({ useCardDomRef: () => ({ current: document.createElement('div') }) }))
jest.mock('features/cardCreator/utils/save/prepareCloudSave', () => {
    const actual = jest.requireActual('features/cardCreator/utils/save/prepareCloudSave')
    return { ...actual, prepareCloudSaveForm: (...args: unknown[]) => mockPrepare(...args) }
})
type ListArgs = { page: number, limit: number }
type FakeSave = { id: string, name: string, saveTime: string, previewImg: string, linkedPosts?: { id: string, title: string }[] }
const oneSave: FakeSave[] = [{ id: 's1', name: 'My save', saveTime: '2024-01-01T00:00:00', previewImg: '/p.webp' }]
let mockSaves: FakeSave[] = oneSave

jest.mock('features/cardCreator/api/SaveInfoApi', () => ({
    useGetSaveListQuery: (args: ListArgs, options: unknown) => {
        mockListQuery(args, options)
        const start = args.page * args.limit
        return { data: { list: mockSaves.slice(start, start + args.limit), total: mockSaves.length }, isFetching: false, error: undefined }
    },
    useLazyGetSaveQuery: () => [jest.fn(), { isFetching: false }],
    useCreateSaveMutation: () => [jest.fn()],
    useUpdateSaveMutation: () => [mockUpdate],
    useDeleteSaveMutation: () => [mockDelete, { isLoading: false }],
}))

function setup() {
    const store = makeStore()
    render(<Provider store={store}><CardEditorContext.Provider value={idEditor}><SaveCloudMenu/></CardEditorContext.Provider></Provider>)
    return store
}

describe('SaveCloudMenu', () => {
    beforeEach(() => {
        mockSaves = oneSave
        mockListQuery.mockClear()
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

    it('creates a cloud save with the chosen name', async () => {
        setup()
        fireEvent.click(screen.getByRole('button', { name: 'Create a new save' }))
        fireEvent.change(screen.getByLabelText('Enter the name of the save:'), { target: { value: 'Cloud one' } })
        await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Create' })) })
        expect(mockPrepare).toHaveBeenCalledWith(expect.objectContaining({ name: 'Cloud one' }), expect.anything())
    })

    it('debounces the cloud save search', () => {
        jest.useFakeTimers()
        try {
            setup()
            mockListQuery.mockClear()
            fireEvent.change(screen.getByLabelText('Search:'), { target: { value: 'abc' } })
            expect(mockListQuery).toHaveBeenLastCalledWith(expect.objectContaining({ searchName: '' }), expect.anything())
            act(() => { jest.advanceTimersByTime(appConfig.timing.searchDebounceMs) })
            expect(mockListQuery).toHaveBeenLastCalledWith(expect.objectContaining({ searchName: 'abc' }), expect.anything())
        } finally {
            jest.useRealTimers()
        }
    })

    describe('pagination', () => {
        const pageSize = appConfig.paging.cloudSavesPerPage
        const makeSaves = (count: number): FakeSave[] => Array.from({ length: count }, (_, i) => ({
            id: `s${i}`, name: `Save ${i}`, saveTime: '2024-01-01T00:00:00', previewImg: `/p${i}.webp`,
        }))
        const lastQueryArgs = () => mockListQuery.mock.calls.at(-1)![0] as ListArgs & { searchName: string }

        it('hides the page nav when everything fits on one page', () => {
            mockSaves = makeSaves(pageSize)
            setup()
            expect(screen.queryByRole('navigation', { name: 'Pagination' })).not.toBeInTheDocument()
        })

        it('requests one page at a time and moves to the next page', () => {
            mockSaves = makeSaves(pageSize + 2)
            setup()
            expect(lastQueryArgs()).toMatchObject({ page: 0, limit: pageSize })
            expect(screen.getAllByRole('button', { name: 'Load' })).toHaveLength(pageSize)

            fireEvent.click(screen.getByRole('button', { name: 'Page 2' }))

            expect(lastQueryArgs()).toMatchObject({ page: 1, limit: pageSize })
            expect(screen.getAllByRole('button', { name: 'Load' })).toHaveLength(2)
            expect(screen.getByText(`Save ${pageSize}`)).toBeInTheDocument()
        })

        it('goes back to the first page when the search changes', () => {
            jest.useFakeTimers()
            try {
                mockSaves = makeSaves(pageSize * 2)
                setup()
                fireEvent.click(screen.getByRole('button', { name: 'Page 2' }))
                expect(lastQueryArgs().page).toBe(1)

                fireEvent.change(screen.getByLabelText('Search:'), { target: { value: 'Save' } })
                act(() => { jest.advanceTimersByTime(appConfig.timing.searchDebounceMs) })

                expect(lastQueryArgs()).toMatchObject({ searchName: 'Save', page: 0 })
            } finally {
                jest.useRealTimers()
            }
        })

        it('steps back a page when the last page becomes empty', () => {
            mockSaves = makeSaves(pageSize + 1)
            const { rerender } = render(<Provider store={makeStore()}><CardEditorContext.Provider value={idEditor}><SaveCloudMenu/></CardEditorContext.Provider></Provider>)
            fireEvent.click(screen.getByRole('button', { name: 'Page 2' }))
            expect(lastQueryArgs().page).toBe(1)

            mockSaves = makeSaves(pageSize)
            rerender(<Provider store={makeStore()}><CardEditorContext.Provider value={idEditor}><SaveCloudMenu/></CardEditorContext.Provider></Provider>)

            expect(lastQueryArgs().page).toBe(0)
            expect(screen.queryByRole('navigation', { name: 'Pagination' })).not.toBeInTheDocument()
        })
    })

    describe('posted in links', () => {
        it('lists the posts that use a save', () => {
            mockSaves = [{ ...oneSave[0], linkedPosts: [{ id: 'p1', title: 'My build' }, { id: 'p2', title: 'Team ideas' }] }]
            setup()
            fireEvent.click(screen.getByRole('button', { name: 'Posted in 2 posts' }))
            const list = screen.getByRole('list', { name: 'Posts using My save' })
            expect(list).toContainElement(screen.getByRole('link', { name: 'My build' }))
            expect(screen.getByRole('link', { name: 'Team ideas' })).toHaveAttribute('href', '/post/p2')
        })

        it('shows nothing for a save without posts', () => {
            setup()
            expect(screen.queryByText(/Posted in/)).not.toBeInTheDocument()
        })

        it('warns before deleting a save that posts use', () => {
            mockSaves = [{ ...oneSave[0], linkedPosts: [{ id: 'p1', title: 'My build' }, { id: 'p2', title: 'Team ideas' }] }]
            setup()
            fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
            expect(screen.getByRole('alertdialog')).toHaveTextContent('This save is used in 2 posts. The posts keep their copy of the card')
        })

        it('leaves the delete message alone for a save without posts', () => {
            setup()
            fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
            expect(screen.getByRole('alertdialog')).not.toHaveTextContent('This save is used in')
        })
    })
})
