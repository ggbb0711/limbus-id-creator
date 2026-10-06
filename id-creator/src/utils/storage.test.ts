import { z } from 'zod'
import { lenientArray, parseJSON, readJSON, readStorage, writeJSON, writeStorage } from './storage'

describe('storage', () => {
    beforeEach(() => localStorage.clear())
    afterEach(() => jest.restoreAllMocks())

    it('round-trips a string', () => {
        writeStorage('k', 'v')
        expect(readStorage('k')).toBe('v')
    })

    it('returns null for a missing key', () => {
        expect(readStorage('missing')).toBeNull()
    })

    it('returns null when reading throws', () => {
        jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('denied') })
        expect(readStorage('k')).toBeNull()
    })

    it('does not throw when writing fails', () => {
        jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('quota') })
        expect(() => writeStorage('k', 'v')).not.toThrow()
    })
})

describe('readJSON / writeJSON', () => {
    const schema = z.array(z.string())

    beforeEach(() => localStorage.clear())
    afterEach(() => jest.restoreAllMocks())

    it('round-trips a value', () => {
        writeJSON('k', ['a', 'b'])
        expect(readJSON('k', schema, [])).toEqual(['a', 'b'])
    })

    it.each([null, '', '{bad', '42', '[1,2]'])('falls back for stored %p', raw => {
        if (raw !== null) localStorage.setItem('k', raw)
        expect(readJSON('k', schema, ['fallback'])).toEqual(['fallback'])
    })

    it('falls back when reading throws', () => {
        jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('denied') })
        expect(readJSON('k', schema, ['fallback'])).toEqual(['fallback'])
    })

    it('applies schema transforms', () => {
        localStorage.setItem('k', '" padded "')
        expect(readJSON('k', z.string().trim(), '')).toBe('padded')
    })
})

describe('parseJSON', () => {
    it.each([null, undefined, '', '   ', '{bad'])('returns the fallback for %p', raw => {
        expect(parseJSON(raw, z.string(), 'fallback')).toBe('fallback')
    })

    it('parses valid json', () => {
        expect(parseJSON('{"a":1}', z.object({ a: z.number() }), { a: 0 })).toEqual({ a: 1 })
    })

    it('returns the fallback when the value does not match the schema', () => {
        expect(parseJSON('{"a":"x"}', z.object({ a: z.number() }), { a: 0 })).toEqual({ a: 0 })
    })

    it('applies schema transforms', () => {
        expect(parseJSON('[1,"x",2]', lenientArray(z.number()), [])).toEqual([1, 2])
    })
})

describe('lenientArray', () => {
    const schema = lenientArray(z.object({ id: z.string() }))

    it('keeps only valid items', () => {
        expect(schema.parse([{ id: 'a' }, { id: 1 }, null, 'x', { id: 'b' }])).toEqual([{ id: 'a' }, { id: 'b' }])
    })

    it('strips unknown fields from items', () => {
        expect(schema.parse([{ id: 'a', extra: true }])).toEqual([{ id: 'a' }])
    })

    it.each([null, undefined, {}, 'text', 42])('returns an empty list for %p', raw => {
        expect(schema.parse(raw)).toEqual([])
    })

    it('works with primitive items', () => {
        expect(lenientArray(z.string()).parse(['a', 1, 'b'])).toEqual(['a', 'b'])
    })
})
