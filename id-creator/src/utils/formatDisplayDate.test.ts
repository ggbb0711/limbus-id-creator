import formatDisplayDate from './formatDisplayDate'

describe('formatDisplayDate', () => {
    it('formats an ISO string as a UTC date', () => {
        expect(formatDisplayDate('2024-03-05T23:30:00Z')).toBe('Mar 5, 2024')
    })

    it('accepts a Date', () => {
        expect(formatDisplayDate(new Date(Date.UTC(2023, 0, 1)))).toBe('Jan 1, 2023')
    })

    it('adds the time when asked', () => {
        expect(formatDisplayDate('2024-03-05T12:00:00Z', { withTime: true })).toMatch(/2024.*\d{1,2}:\d{2}/)
    })

    it('returns unparseable strings unchanged instead of throwing', () => {
        expect(formatDisplayDate('not a date')).toBe('not a date')
        expect(formatDisplayDate('')).toBe('')
    })

    it('returns an empty string for an invalid Date', () => {
        expect(formatDisplayDate(new Date('x'))).toBe('')
    })
})
