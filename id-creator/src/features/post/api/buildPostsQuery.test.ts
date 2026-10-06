import { buildPostsQuery } from './buildPostsQuery'

describe('buildPostsQuery', () => {
    it('uses defaults for title and sort', () => {
        expect(buildPostsQuery({ page: 0, limit: 10 })).toBe('Title=&SortedBy=Latest&page=0&limit=10')
    })

    it('repeats the Tag parameter', () => {
        const params = new URLSearchParams(buildPostsQuery({ page: 1, limit: 5, tag: ['Faust', 'Burn'] }))
        expect(params.getAll('Tag')).toEqual(['Faust', 'Burn'])
    })

    it('only adds UserId when set', () => {
        expect(buildPostsQuery({ page: 0, limit: 5 })).not.toContain('UserId')
        expect(new URLSearchParams(buildPostsQuery({ page: 0, limit: 5, userId: 'u1' })).get('UserId')).toBe('u1')
    })

    it('encodes special characters in the title', () => {
        const query = buildPostsQuery({ page: 0, limit: 5, title: 'a&b#c d' })
        expect(query).toContain('Title=a%26b%23c+d')
        expect(new URLSearchParams(query).get('Title')).toBe('a&b#c d')
    })
})
