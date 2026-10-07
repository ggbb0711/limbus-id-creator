import { sortSavesByTimeDesc } from './sortSaves'

const saves = Object.freeze([
    { id: 'old', saveTime: '2024-01-01T00:00:00Z', updateTime: '2025-06-01T00:00:00Z' },
    { id: 'new', saveTime: '2025-01-01T00:00:00Z', updateTime: '2025-02-01T00:00:00Z' },
    { id: 'bad', saveTime: 'not a date', updateTime: '' },
])

describe('sortSavesByTimeDesc', () => {
    it('sorts newest first by save time without mutating the input', () => {
        expect(sortSavesByTimeDesc(saves).map(s => s.id)).toEqual(['new', 'old', 'bad'])
        expect(saves.map(s => s.id)).toEqual(['old', 'new', 'bad'])
    })

    it('can sort by update time', () => {
        expect(sortSavesByTimeDesc(saves, 'updateTime').map(s => s.id)).toEqual(['old', 'new', 'bad'])
    })

    it('keeps the original order for equal times', () => {
        const same = [{ id: 'a', saveTime: '2025-01-01' }, { id: 'b', saveTime: '2025-01-01' }]
        expect(sortSavesByTimeDesc(same).map(s => s.id)).toEqual(['a', 'b'])
    })
})
