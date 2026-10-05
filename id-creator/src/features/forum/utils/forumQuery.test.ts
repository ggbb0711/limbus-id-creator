import { buildForumQuery, parseSort, tagKeyOf } from 'features/forum/utils/forumQuery'
import { TagList } from 'features/post'

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

describe('tagKeyOf', () => {
    it('finds the key for a tag', () => {
        const [key, tag] = Object.entries(TagList)[0]
        expect(tagKeyOf(tag)).toBe(key)
    })

    it('returns undefined for a missing or unknown tag', () => {
        expect(tagKeyOf(undefined)).toBeUndefined()
        expect(tagKeyOf({ tagName: 'not a tag', icon: '' })).toBeUndefined()
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
    })

    it('encodes special characters', () => {
        expect(buildForumQuery('', { q: 'a&b #c' })).toBe('q=a%26b+%23c')
    })
})
