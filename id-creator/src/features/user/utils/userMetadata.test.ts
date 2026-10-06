import { userMetadata } from './userMetadata'

describe('userMetadata', () => {
    it('describes the user as a profile for link previews', () => {
        const meta = userMetadata({ id: 'u1', userName: 'Meph' })
        expect(meta.openGraph).toMatchObject({ type: 'profile', title: 'Meph', username: 'Meph', url: '/user/u1', siteName: 'Limbus ID Creator' })
        expect(meta.openGraph).not.toHaveProperty('images')
        expect(meta.twitter).toMatchObject({ card: 'summary_large_image', title: 'Meph' })
        expect(meta.alternates).toEqual({ canonical: '/user/u1' })
    })
})
