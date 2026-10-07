import { getResistTier } from './getResistTier'

describe('getResistTier', () => {
    it.each([
        [0.5, 'Ineff', 'var(--Endure)'],
        [0.75, 'Endure', 'var(--Endure)'],
        [1, 'Normal', 'var(--Normal)'],
        [1.49, 'Normal', 'var(--Normal)'],
        [1.5, 'Weak', 'var(--Fatal)'],
        [1.99, 'Weak', 'var(--Fatal)'],
        [2, 'Fatal', 'var(--Fatal)'],
        [3, 'Fatal', 'var(--Fatal)'],
    ])('damage %p is %s', (value, label, color) => {
        expect(getResistTier(value)).toEqual({ label, color })
    })

    it.each([
        [0.5, 'Ineff', 'var(--Endure)'],
        [0.99, 'Endure', 'var(--Endure)'],
        [1.5, 'Normal', 'var(--Normal)'],
        [1.99, 'Normal', 'var(--Normal)'],
        [2, 'Fatal', 'var(--Fatal)'],
    ])('sin %p is %s', (value, label, color) => {
        expect(getResistTier(value)).toEqual({ label, color })
    })
})
