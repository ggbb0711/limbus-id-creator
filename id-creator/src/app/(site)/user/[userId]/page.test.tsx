import { notFound } from 'next/navigation'
import { getUser } from 'features/user/api/server/users'

jest.mock('server-only', () => ({}))
jest.mock('next/navigation', () => ({ notFound: jest.fn(() => { throw new Error('NEXT_NOT_FOUND') }) }))
jest.mock('features/user/api/server/users', () => ({ getUser: jest.fn() }))
jest.mock('features/user/userPage/UserPage', () => () => null)

import UnavailablePage from 'components/unavailablePage/UnavailablePage'
import Page, { generateMetadata, generateStaticParams, revalidate } from './page'

const params = (userId: string) => ({ params: Promise.resolve({ userId }) }) as never

describe('user page', () => {
    beforeEach(() => {
        jest.mocked(getUser).mockReset()
        jest.mocked(notFound).mockClear()
    })

    it('is rendered on demand and cached', () => {
        expect(generateStaticParams()).toEqual([])
        expect(revalidate).toBe(3600)
    })

    it('calls notFound for a missing user', async () => {
        jest.mocked(getUser).mockResolvedValue(null)
        await expect(Page(params('missing'))).rejects.toThrow('NEXT_NOT_FOUND')
        expect(notFound).toHaveBeenCalled()
    })

    it('titles a missing user as not found', async () => {
        jest.mocked(getUser).mockResolvedValue(null)
        await expect(generateMetadata(params('missing'))).resolves.toEqual({ title: 'User not found' })
    })

    it('renders an existing user as not owned', async () => {
        jest.mocked(getUser).mockResolvedValue({ id: 'u1' } as never)
        const element = await Page(params('u1'))
        expect(element.props).toEqual({ initialUser: { id: 'u1', owned: false } })
    })

    it('renders the unavailable page for USER_BANNED', async () => {
        jest.mocked(getUser).mockResolvedValue({ unavailable: true, code: 'USER_BANNED' })
        const element = await Page(params('gone'))
        expect(element.type).toBe(UnavailablePage)
        expect(element.props).toEqual({ code: 'USER_BANNED' })
        expect(notFound).not.toHaveBeenCalled()
    })

    it('titles USER_BANNED as User banned and keeps it out of search', async () => {
        jest.mocked(getUser).mockResolvedValue({ unavailable: true, code: 'USER_BANNED' })
        await expect(generateMetadata(params('gone'))).resolves.toEqual({ title: 'User banned', robots: { index: false } })
    })
})
