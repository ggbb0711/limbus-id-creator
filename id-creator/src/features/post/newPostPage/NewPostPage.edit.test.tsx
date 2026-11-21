import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NewPostPage from './NewPostPage'
import { IPost } from 'features/post/types/IPost'

const mockUpdate = jest.fn()
const mockCreate = jest.fn()
const mockPush = jest.fn()
const mockAlert = jest.fn()
const mockRevalidate = jest.fn()

jest.mock('hooks/useAuth', () => ({ useAuth: () => ({ user: { id: 'author' }, isInitializing: false }) }))
jest.mock('hooks/useAddAlert', () => ({ useAddAlert: () => mockAlert }))
jest.mock('next/navigation', () => ({ useRouter: () => ({ push: mockPush }) }))
jest.mock('features/post/api/server/revalidatePost', () => ({ revalidatePost: (...args: unknown[]) => mockRevalidate(...args) }))
jest.mock('features/post/api/PostApi', () => ({
    useUpdatePostMutation: () => [mockUpdate, { isLoading: false }],
    useCreatePostMutation: () => [mockCreate, { isLoading: false }],
}))
jest.mock('features/post/components/richTextEditor/RichTextEditor', () => ({
    __esModule: true,
    default: ({ value, onChange }: { value: string, onChange: (v: string) => void }) =>
        <textarea aria-label="Description" value={value} onChange={e => onChange(e.target.value)}/>,
}))
jest.mock('features/cardCreator', () => ({
    ...jest.requireActual('features/cardCreator'),
    SearchSaveInput: ({ chooseSave }: { chooseSave: (save: { id: string, previewUrl: string }) => void }) =>
        <button type="button" onClick={() => chooseSave({ id: 'picked', previewUrl: 'picked.png' })}>Pick save</button>,
}))

const post = (cards: NonNullable<IPost['slides']>[number]['card'][]) => ({
    id: 'p1', title: 'My post', description: 'Old text', userId: 'author', tags: ['Identity', 'Burn'],
    slides: cards.map(card => ({ imageUrl: card?.imageUrl ?? '', card })),
    imagesAttach: [], created: '', viewCount: 0, commentCount: 0, userName: '', userIcon: '',
}) as unknown as IPost

const card = (id: string, position: number, saveId: string | null = `save-${id}`) =>
    ({ id, position, kind: 'Identity' as const, imageUrl: `${id}.png`, saveId, saveInfo: {} })

const twoCards = () => post([card('c1', 0), card('c2', 1)])

beforeEach(() => {
    jest.clearAllMocks()
    mockUpdate.mockReturnValue({ unwrap: () => Promise.resolve({ id: 'p1' }) })
})

describe('NewPostPage in edit mode', () => {
    it('shows the title read-only and prefills the form', () => {
        render(<NewPostPage post={twoCards()}/>)

        expect(screen.getByRole('heading', { name: 'Edit post' })).toBeInTheDocument()
        const title = screen.getByLabelText('Post Name:')
        expect(title).toHaveValue('My post')
        expect(title).toHaveAttribute('readonly')
        expect(screen.getByLabelText('Description')).toHaveValue('Old text')
        expect(screen.getByText('Tags 1/', { exact: false })).toBeInTheDocument()
        expect(screen.getAllByRole('img').map(img => img.getAttribute('src'))).toEqual(['c1.png', 'c2.png'])
    })

    it('shows Update, Replace and Delete for each card', () => {
        render(<NewPostPage post={twoCards()}/>)

        expect(screen.getByRole('button', { name: 'Update image 1 from its save' })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Replace image 2' })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Remove image 1' })).toBeEnabled()
    })

    it('hides Update when the save was deleted', () => {
        render(<NewPostPage post={post([card('c1', 0, null), card('c2', 1)])}/>)

        expect(screen.queryByRole('button', { name: 'Update image 1 from its save' })).not.toBeInTheDocument()
        expect(screen.getByText('Save deleted')).toBeInTheDocument()
    })

    it('disables Delete when one card is left', () => {
        render(<NewPostPage post={post([card('c1', 0)])}/>)

        expect(screen.getByRole('button', { name: 'Remove image 1' })).toBeDisabled()
    })

    it('replaces a slot with the next picked save', async () => {
        const user = userEvent.setup()
        render(<NewPostPage post={twoCards()}/>)

        await user.click(screen.getByRole('button', { name: 'Replace image 1' }))
        expect(screen.getByText('Pick the ID/EGO that replaces image 1:')).toBeInTheDocument()
        await user.click(screen.getByRole('button', { name: 'Pick save' }))

        expect(screen.getAllByRole('img').map(img => img.getAttribute('src'))).toEqual(['picked.png', 'c2.png'])
        expect(screen.getByText('Replaced')).toBeInTheDocument()
        await user.click(screen.getByRole('button', { name: 'Undo changes to image 1' }))
        expect(screen.getAllByRole('img').map(img => img.getAttribute('src'))).toEqual(['c1.png', 'c2.png'])
    })

    it('sends the cards, tags and description without a title', async () => {
        const user = userEvent.setup()
        render(<NewPostPage post={post([card('c1', 0), card('c2', 1), card('c3', 2)])}/>)

        await user.click(screen.getByRole('button', { name: 'Update image 1 from its save' }))
        expect(screen.getByText('Will update')).toBeInTheDocument()
        await user.click(screen.getByRole('button', { name: 'Remove image 2' }))
        await user.clear(screen.getByLabelText('Description'))
        await user.type(screen.getByLabelText('Description'), 'New text')
        await user.click(screen.getByRole('button', { name: 'Save changes' }))

        expect(mockUpdate).toHaveBeenCalledWith({
            id: 'p1',
            body: {
                description: 'New text',
                tags: ['Burn', 'Identity'],
                cards: [{ saveId: 'save-c1', kind: 'Identity' }, { cardId: 'c3' }],
            },
        })
        expect(mockRevalidate).toHaveBeenCalledWith('p1', 'author')
        expect(mockPush).toHaveBeenCalledWith('/post/p1')
        expect(mockCreate).not.toHaveBeenCalled()
    })

    it('shows the API error and stays on the page', async () => {
        const user = userEvent.setup()
        mockUpdate.mockReturnValue({ unwrap: () => Promise.reject({ status: 409, data: { message: 'Still uploading' } }) })
        render(<NewPostPage post={twoCards()}/>)

        await user.click(screen.getByRole('button', { name: 'Save changes' }))

        expect(mockAlert).toHaveBeenCalledWith('Failure', expect.any(String))
        expect(mockPush).not.toHaveBeenCalled()
    })
})

describe('NewPostPage in create mode', () => {
    it('keeps the editable title and no edit buttons', () => {
        render(<NewPostPage/>)

        expect(screen.getByRole('heading', { name: 'Create new post' })).toBeInTheDocument()
        expect(screen.getByLabelText(/Post Name \(Required\)/)).not.toHaveAttribute('readonly')
        expect(screen.queryByRole('button', { name: /Replace image/ })).not.toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Post' })).toBeInTheDocument()
    })

    it('creates a post from picked saves', async () => {
        const user = userEvent.setup()
        mockCreate.mockReturnValue({ unwrap: () => Promise.resolve({ id: 'new' }) })
        render(<NewPostPage/>)

        await user.type(screen.getByLabelText(/Post Name \(Required\)/), 'Title')
        await user.click(screen.getByRole('button', { name: 'Pick save' }))
        await user.click(screen.getByRole('button', { name: 'Post' }))

        expect(mockCreate).toHaveBeenCalledWith(expect.objectContaining({ title: 'Title', cards: [{ saveId: 'picked', kind: 'Identity' }] }))
        expect(mockPush).toHaveBeenCalledWith('/post/new')
    })
})
