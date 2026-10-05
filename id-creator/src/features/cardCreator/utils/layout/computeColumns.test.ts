import { computeColumns } from './computeColumns'

describe('computeColumns', () => {
    it('uses one column when there is nothing to lay out', () => {
        expect(computeColumns([], 1000)).toEqual({ columns: 1, width: 500 })
    })

    it('keeps items that fit in one column', () => {
        expect(computeColumns([300, 300], 1000)).toEqual({ columns: 1, width: 500 })
    })

    it('starts a new column when the next item overflows', () => {
        expect(computeColumns([400, 400, 400], 1000)).toEqual({ columns: 2, width: 1025 })
    })

    it('gives an item taller than the container its own column', () => {
        expect(computeColumns([100, 2000, 100], 1000).columns).toBe(3)
    })

    it('accepts custom sizes', () => {
        expect(computeColumns([60, 60], 100, { gap: 10, columnWidth: 50, tolerance: 0 })).toEqual({ columns: 2, width: 110 })
    })
})
