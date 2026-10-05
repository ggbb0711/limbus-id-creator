import { canAddTag } from './canAddTag'

describe('canAddTag', () => {
    it('accepts a new item below the limit', () => {
        expect(canAddTag(['a'], 'b', 2)).toBe(true)
    })

    it.each([[''], ['   ']])('rejects blank strings %p', value => {
        expect(canAddTag([], value, 5)).toBe(false)
    })

    it('rejects duplicates, missing items and full lists', () => {
        expect(canAddTag(['a'], 'a', 5)).toBe(false)
        expect(canAddTag(['a'], undefined, 5)).toBe(false)
        expect(canAddTag(['a'], null, 5)).toBe(false)
        expect(canAddTag(['a', 'b'], 'c', 2)).toBe(false)
    })

    it('uses the given comparison', () => {
        const byName = (x: { name: string }, y: { name: string }) => x.name === y.name
        expect(canAddTag([{ name: 'x' }], { name: 'x' }, 5, byName)).toBe(false)
        expect(canAddTag([{ name: 'x' }], { name: 'x' }, 5)).toBe(true)
    })
})
