import { getResistTier } from './getResistTier'

describe('getResistTier', () => {
    it.each([
        [0, 'Ineff', 'var(--Ineff)'],
        [0.25, 'Ineff', 'var(--Ineff)'],
        [0.5, 'Ineff', 'var(--Ineff)'],
        [0.51, 'Endure', 'var(--Endure)'],
        [0.75, 'Endure', 'var(--Endure)'],
        [0.99, 'Endure', 'var(--Endure)'],
        [1, 'Normal', 'var(--Normal)'],
        [1.01, 'Weak', 'var(--Weak)'],
        [1.25, 'Weak', 'var(--Weak)'],
        [1.49, 'Weak', 'var(--Weak)'],
        [1.5, 'Fatal', 'var(--Fatal)'],
        [1.99, 'Fatal', 'var(--Fatal)'],
        [2, 'Fatal', 'var(--Fatal)'],
        [3, 'Fatal', 'var(--Fatal)'],
    ])('%p is %s', (value, label, color) => {
        expect(getResistTier(value)).toEqual({ label, color })
    })
})
