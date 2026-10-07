import formatDisplayDate, { DATE_FALLBACK, parseServerDate } from './formatDisplayDate'

describe('parseServerDate', () => {
    it('treats an ISO date-time without an offset as UTC', () => {
        expect(parseServerDate('2024-03-05T23:30:00')?.toISOString()).toBe('2024-03-05T23:30:00.000Z')
        expect(parseServerDate('2024-03-05T23:30:00.123456')?.toISOString()).toBe('2024-03-05T23:30:00.123Z')
    })

    it('keeps strings that already have an offset', () => {
        expect(parseServerDate('2024-03-05T23:30:00Z')?.toISOString()).toBe('2024-03-05T23:30:00.000Z')
        expect(parseServerDate('2024-03-05T23:30:00+02:00')?.toISOString()).toBe('2024-03-05T21:30:00.000Z')
    })

    it('returns null for invalid input', () => {
        expect(parseServerDate('not a date')).toBeNull()
        expect(parseServerDate('')).toBeNull()
        expect(parseServerDate(undefined)).toBeNull()
        expect(parseServerDate(new Date('x'))).toBeNull()
    })
})

describe('formatDisplayDate', () => {
    it('formats the stored calendar date without shifting it', () => {
        expect(formatDisplayDate('2024-03-05T23:30:00')).toBe('Mar 5, 2024')
        expect(formatDisplayDate('2024-03-05T00:10:00')).toBe('Mar 5, 2024')
    })

    it('accepts a Date', () => {
        expect(formatDisplayDate(new Date(Date.UTC(2023, 0, 1)))).toBe('Jan 1, 2023')
    })

    it('adds the time when asked', () => {
        expect(formatDisplayDate('2024-03-05T12:00:00', { withTime: true })).toBe('Mar 5, 2024, 12:00 PM')
        expect(formatDisplayDate('2024-03-05T12:00:00Z', { withTime: true })).toMatch(/2024.*\d{1,2}:\d{2}/)
    })

    it('returns the fallback instead of throwing', () => {
        expect(formatDisplayDate('not a date')).toBe(DATE_FALLBACK)
        expect(formatDisplayDate(new Date('x'))).toBe(DATE_FALLBACK)
        expect(formatDisplayDate('', { fallback: '' })).toBe('')
    })
})
