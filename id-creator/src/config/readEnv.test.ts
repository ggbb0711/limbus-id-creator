import { __resetEnvWarnings, readInt, readNumber, readRequiredString, readString } from './readEnv'

describe('readNumber / readInt', () => {
    let warn: jest.SpyInstance

    beforeEach(() => {
        __resetEnvWarnings()
        warn = jest.spyOn(console, 'warn').mockImplementation(() => {})
    })

    afterEach(() => warn.mockRestore())

    it.each([undefined, '', '   ', 'abc', 'Infinity', 'NaN'])('falls back for %p', raw => {
        expect(readNumber(raw, 'X', 7)).toBe(7)
    })

    it('reads valid numbers', () => {
        expect(readNumber('0.5', 'X', 1)).toBe(0.5)
        expect(readInt('42', 'X', 1)).toBe(42)
    })

    it('falls back when the value is outside the range', () => {
        expect(readInt('0', 'X', 40, { min: 1 })).toBe(40)
        expect(readNumber('1.5', 'X', 0.7, { min: 0, max: 1 })).toBe(0.7)
    })

    it('rejects fractions for integers', () => {
        expect(readInt('1.5', 'X', 3)).toBe(3)
    })

    it('warns once per variable', () => {
        readInt('abc', 'ONCE', 1)
        readInt('abc', 'ONCE', 1)
        readInt(undefined, 'OTHER', 1)
        expect(warn).toHaveBeenCalledTimes(2)
    })

    it('does not warn in production', () => {
        const env = process.env as Record<string, string | undefined>
        const previous = env.NODE_ENV
        env.NODE_ENV = 'production'
        readInt('abc', 'PROD', 1)
        env.NODE_ENV = previous
        expect(warn).not.toHaveBeenCalled()
    })
})

describe('readString', () => {
    it('uses the fallback only when the variable is unset', () => {
        expect(readString(undefined, 'default')).toBe('default')
        expect(readString('', 'default')).toBe('')
        expect(readString(' value ', 'default')).toBe('value')
    })
})

describe('readRequiredString', () => {
    beforeEach(() => __resetEnvWarnings())

    it('returns the trimmed value without warning', () => {
        const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})
        expect(readRequiredString(' https://api ', 'NEXT_PUBLIC_SERVER_URL')).toBe('https://api')
        expect(warn).not.toHaveBeenCalled()
        warn.mockRestore()
    })

    it('warns once when the value is missing or blank', () => {
        const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})
        expect(readRequiredString(undefined, 'NEXT_PUBLIC_SERVER_URL')).toBe('')
        expect(readRequiredString('  ', 'NEXT_PUBLIC_SERVER_URL')).toBe('')
        expect(warn).toHaveBeenCalledTimes(1)
        expect(warn.mock.calls[0][0]).toContain('NEXT_PUBLIC_SERVER_URL')
        warn.mockRestore()
    })
})
