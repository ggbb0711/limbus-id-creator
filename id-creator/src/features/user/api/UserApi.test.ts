import { makeStore } from 'stores/AppStore'
import { setCredentials, updateSessionUser } from 'stores/slices/AuthSlice'
import { sessionUserUpdate } from './UserApi'

const profile = { id: 'me', userName: 'New name', userIcon: '/new.webp', createdAt: '2024-01-01T00:00:00', userEmail: '', owned: false }

describe('session user sync', () => {
    it('updates the logged-in user after their own profile changes', () => {
        const store = makeStore()
        store.dispatch(setCredentials({ accessToken: 't', user: { id: 'me', userEmail: 'e', userName: 'Old', userIcon: '/old.webp' } }))
        const update = sessionUserUpdate(store.getState().auth.user, 'me', profile)
        expect(update).toEqual(updateSessionUser({ userName: 'New name', userIcon: '/new.webp' }))
        store.dispatch(update!)
        expect(store.getState().auth.user).toMatchObject({ id: 'me', userName: 'New name', userIcon: '/new.webp', userEmail: 'e' })
    })

    it('ignores updates to someone else or when logged out', () => {
        expect(sessionUserUpdate({ id: 'me' }, 'other', profile)).toBeNull()
        expect(sessionUserUpdate(null, 'me', profile)).toBeNull()
    })

    it('updateSessionUser is a no-op without a session', () => {
        const store = makeStore()
        store.dispatch(updateSessionUser({ userName: 'x' }))
        expect(store.getState().auth.user).toBeNull()
    })
})
