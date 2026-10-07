import { act, fireEvent, render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { makeStore } from 'stores/AppStore'
import { UserProfile } from './UserProfile'

const mockUpdate = jest.fn()
jest.mock('features/user/api/UserApi', () => ({
    useUpdateUserMutation: () => [mockUpdate, { isLoading: false }],
}))

const profile = { id: 'u1', userName: 'Faust', userIcon: '/f.webp', createdAt: '2024-01-01T00:00:00', userEmail: '', owned: false }
const renderProfile = () => render(<Provider store={makeStore()}><UserProfile userProfile={profile} owned/></Provider>)

describe('UserProfile', () => {
    beforeEach(() => {
        mockUpdate.mockReset()
        mockUpdate.mockReturnValue({ unwrap: () => Promise.resolve(profile) })
    })

    it('uploads an icon with the saved name, not an unconfirmed draft', async () => {
        renderProfile()
        fireEvent.click(screen.getByRole('button', { name: /Edit$/ }))
        fireEvent.change(screen.getByRole('textbox', { name: 'Username' }), { target: { value: 'Half typed' } })
        const file = new File(['x'], 'a.png', { type: 'image/png' })
        await act(async () => {
            fireEvent.change(screen.getByLabelText(/Edit profile picture/), { target: { files: [file] } })
        })
        expect(mockUpdate).toHaveBeenCalledWith({ userId: 'u1', name: 'Faust', iconFile: file })
    })

    it('cancel restores the saved name', () => {
        renderProfile()
        fireEvent.click(screen.getByRole('button', { name: /Edit$/ }))
        fireEvent.change(screen.getByRole('textbox', { name: 'Username' }), { target: { value: 'Draft' } })
        fireEvent.click(screen.getByRole('button', { name: /Cancel/ }))
        expect(screen.getByText('Faust')).toBeInTheDocument()
        fireEvent.click(screen.getByRole('button', { name: /Edit$/ }))
        expect(screen.getByRole('textbox', { name: 'Username' })).toHaveValue('Faust')
    })

    it('rejects a whitespace name without calling the API', () => {
        renderProfile()
        fireEvent.click(screen.getByRole('button', { name: /Edit$/ }))
        fireEvent.change(screen.getByRole('textbox', { name: 'Username' }), { target: { value: '   ' } })
        fireEvent.click(screen.getByRole('button', { name: /Confirm/ }))
        expect(screen.getByRole('alert')).toHaveTextContent(/at least one character/)
        expect(mockUpdate).not.toHaveBeenCalled()
    })

    it('saves a trimmed name', async () => {
        renderProfile()
        fireEvent.click(screen.getByRole('button', { name: /Edit$/ }))
        fireEvent.change(screen.getByRole('textbox', { name: 'Username' }), { target: { value: '  Mephi  ' } })
        await act(async () => { fireEvent.click(screen.getByRole('button', { name: /Confirm/ })) })
        expect(mockUpdate).toHaveBeenCalledWith({ userId: 'u1', name: 'Mephi' })
    })

    it('hides editing controls for other users', () => {
        render(<Provider store={makeStore()}><UserProfile userProfile={profile} owned={false}/></Provider>)
        expect(screen.queryByRole('button', { name: /Edit/ })).not.toBeInTheDocument()
        expect(screen.queryByLabelText(/Edit profile picture/)).not.toBeInTheDocument()
    })
})
