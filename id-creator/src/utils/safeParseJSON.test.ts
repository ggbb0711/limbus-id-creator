import { safeParseJSON } from './safeParseJSON'

describe('safeParseJSON', () => {
    it.each([null, undefined, '', '   ', '{bad'])('returns the fallback for %p', raw => {
        expect(safeParseJSON(raw, 'fallback')).toBe('fallback')
    })

    it('parses valid json', () => {
        expect(safeParseJSON('{"a":1}', {})).toEqual({ a: 1 })
    })

    it('runs the converter on the parsed value', () => {
        const numbers = (value: unknown) => (Array.isArray(value) ? value.filter((v): v is number => typeof v === 'number') : [])
        expect(safeParseJSON('[1,"x",2]', [], numbers)).toEqual([1, 2])
        expect(safeParseJSON('{"a":1}', [], numbers)).toEqual([])
    })

    it('returns the fallback when the converter throws', () => {
        expect(safeParseJSON('1', 'fallback', () => { throw new Error('bad') })).toBe('fallback')
    })
})
