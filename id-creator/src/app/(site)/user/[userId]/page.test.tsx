import { notFound } from 'next/navigation'
import { getUser } from 'features/user/api/server/users'

jest.mock('server-only', () => ({}))
jest.mock('next/navigation', () => ({ notFound: jest.fn(() => { throw new Error('NEXT_NOT_FOUND') }) }))
jest.mock('features/user/api/server/users', () => ({ getUser: jest.fn() }))
jest.mock('features/user/userPage/UserPage', () => () => null)

import Page, { generateMetadata, generateStaticParams, revalidate } from './page'

const params = (userId: string) => ({ params: Promise.resolve({ userId }) }) as never

describe('user page', () => {
    beforeEach(() => jest.mocked(getUser).mockReset())

    it('is rendered on demand and cached', () => {
        expect(generateStaticParams()).toEqual([])
        expect(revalidate).toBe(60)
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
})
