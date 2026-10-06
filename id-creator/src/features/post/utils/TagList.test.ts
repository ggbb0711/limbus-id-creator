import { TAG_KEYS, TagList, filterTags, getTag, isTagKey, tagKeyOf } from './TagList'

describe('TagList lookups', () => {
    it('accepts only its own keys', () => {
        expect(isTagKey('Faust')).toBe(true)
        expect(isTagKey('constructor')).toBe(false)
        expect(isTagKey('toString')).toBe(false)
        expect(isTagKey('__proto__')).toBe(false)
        expect(isTagKey(3)).toBe(false)
    })

    it('getTag returns undefined for prototype keys', () => {
        expect(getTag('Faust')).toEqual(TagList.Faust)
        expect(getTag('constructor')).toBeUndefined()
    })

    it('maps a tag back to its key', () => {
        expect(tagKeyOf(TagList.Don_Quixote)).toBe('Don_Quixote')
        expect(tagKeyOf({ icon: '', tagName: 'nope' })).toBeUndefined()
    })

    it('filters by key, treating spaces as underscores', () => {
        expect(filterTags('don qui')).toEqual([TagList.Don_Quixote])
        expect(filterTags('')).toHaveLength(TAG_KEYS.length)
        expect(filterTags('zzz')).toEqual([])
    })
})
