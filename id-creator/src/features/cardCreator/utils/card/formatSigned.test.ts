import formatSigned from './formatSigned'

describe('formatSigned', () => {
    it.each([
        [-3, '-3'],
        [0, '+0'],
        [5, '+5'],
        [1.5, '+1.5'],
        [Number.NaN, '+0'],
    ])('%p -> %s', (value, text) => {
        expect(formatSigned(value)).toBe(text)
    })
})
