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
        expect(tagKeyOf(undefined)).toBeUndefined()
    })

    it('filters by key, treating spaces as underscores', () => {
        expect(filterTags('don qui')).toEqual([TagList.Don_Quixote])
        expect(filterTags('')).toHaveLength(TAG_KEYS.length)
        expect(filterTags('zzz')).toEqual([])
    })
})

describe('TagList sinner tags', () => {
    it('keeps the keys, names and icons the backend stores', () => {
        const sinners = [
            ['Yi_Sang', 'Yi Sang'], ['Faust', 'Faust'], ['Don_Quixote', 'Don Quixote'], ['Ryoshu', 'Ryoshu'],
            ['Meursault', 'Meursault'], ['Hong_Lu', 'Hong Lu'], ['Heathcliff', 'Heathcliff'], ['Ishmael', 'Ishmael'],
            ['Sinclair', 'Sinclair'], ['Rodion', 'Rodion'], ['Outis', 'Outis'], ['Gregor', 'Gregor'],
        ]
        expect(TAG_KEYS.slice(0, 12)).toEqual(sinners.map(([key]) => key))
        sinners.forEach(([key, tagName]) => {
            expect(getTag(key)).toEqual({ icon: `/Images/sinner-icon/${key}_Icon.webp`, tagName })
        })
    })

    it('keeps the non-sinner tags after the sinners', () => {
        expect(TAG_KEYS.slice(12)).toEqual(['Charge', 'Bleed', 'Burn', 'Tremor', 'Sinking', 'Rupture', 'Poise', 'Identity', 'Ego'])
    })
})
