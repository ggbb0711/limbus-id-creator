import { buildForumQuery, parseForumParams, parseSort, toSearchParams } from 'features/forum/utils/forumQuery'

describe('parseSort', () => {
    it.each([
        [null, 'Latest'],
        ['Title', 'Title'],
        ['MostViewed', 'MostViewed'],
        ['0', 'Latest'],
        ['toString', 'Latest'],
        ['nope', 'Latest'],
    ])('%p -> %s', (value, sort) => {
        expect(parseSort(value)).toBe(sort)
    })
})

describe('buildForumQuery', () => {
    it('sets and clears the search text', () => {
        expect(buildForumQuery('', { q: 'abc' })).toBe('q=abc')
        expect(buildForumQuery('q=abc', { q: '' })).toBe('')
    })

    it('replaces tags with repeated parameters', () => {
        expect(buildForumQuery('tag=old&q=x', { tag: ['a', 'b'] })).toBe('q=x&tag=a&tag=b')
    })

    it('drops the default sort from the url', () => {
        expect(buildForumQuery('', { sort: 'Title' })).toBe('sort=Title')
        expect(buildForumQuery('sort=Title', { sort: 'Latest' })).toBe('')
    })

    it('resets the page unless one is given', () => {
        expect(buildForumQuery('page=3&q=x', { q: 'y' })).toBe('q=y')
        expect(buildForumQuery('', { page: 2 })).toBe('page=2')
        expect(buildForumQuery('page=3&q=x', { page: 5 })).toBe('page=5&q=x')
        expect(buildForumQuery('q=x', { page: 0 })).toBe('q=x')
    })

    it('encodes special characters', () => {
        expect(buildForumQuery('', { q: 'a&b #c' })).toBe('q=a%26b+%23c')
    })
})

describe('parseForumParams', () => {
    it('drops prototype keys and unknown tags', () => {
        const params = new URLSearchParams('tag=constructor&tag=toString&tag=__proto__&tag=Faust&tag=nope')
        expect(parseForumParams(params).tagKeys).toEqual(['Faust'])
    })

    it('removes duplicate tags', () => {
        expect(parseForumParams(new URLSearchParams('tag=Faust&tag=Faust&tag=Burn')).tagKeys).toEqual(['Faust', 'Burn'])
    })

    it('reads search, sort and page with safe defaults', () => {
        expect(parseForumParams(new URLSearchParams('q=hi&sort=bogus&page=1.5'))).toEqual({ q: 'hi', tagKeys: [], sort: 'Latest', page: 0 })
        expect(parseForumParams(new URLSearchParams('sort=Title&page=2'))).toMatchObject({ sort: 'Title', page: 2 })
    })
})

describe('toSearchParams', () => {
    it('turns a Next searchParams record into URLSearchParams', () => {
        const params = toSearchParams({ q: 'a b', tag: ['Faust', 'Burn'], page: undefined })
        expect(params.get('q')).toBe('a b')
        expect(params.getAll('tag')).toEqual(['Faust', 'Burn'])
        expect(params.has('page')).toBe(false)
    })
})
