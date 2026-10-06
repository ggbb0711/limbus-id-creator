import { validateUsername } from './validateUsername'

describe('validateUsername', () => {
    it.each([
        ['', false], ['   ', false], ['a', true], ['x'.repeat(5), true], ['x'.repeat(6), false], ['  abc  ', true],
    ])('%p -> valid %p', (name, valid) => {
        expect(validateUsername(name, 5) === null).toBe(valid)
    })

    it('mentions the limit', () => {
        expect(validateUsername('', 5)).toMatch(/at most 5 characters/)
    })
})
