import { reorderSkills } from './reorderSkills'

const list = ['a', 'b', 'c', 'd'].map(inputId => ({ inputId }))
const ids = (items: { inputId: string }[]) => items.map(item => item.inputId)

describe('reorderSkills', () => {
    it('puts a skill moved down after its target', () => {
        const result = reorderSkills(list, 'a', 'c')
        expect(ids(result!.list)).toEqual(['b', 'c', 'a', 'd'])
        expect(result!.newIndex).toBe(2)
    })

    it('puts a skill moved up before its target', () => {
        const result = reorderSkills(list, 'd', 'b')
        expect(ids(result!.list)).toEqual(['a', 'd', 'b', 'c'])
        expect(result!.newIndex).toBe(1)
    })

    it('swaps neighbours', () => {
        expect(ids(reorderSkills(list, 'a', 'b')!.list)).toEqual(['b', 'a', 'c', 'd'])
        expect(ids(reorderSkills(list, 'b', 'a')!.list)).toEqual(['b', 'a', 'c', 'd'])
    })

    it('returns null when nothing should move', () => {
        expect(reorderSkills(list, 'a', 'a')).toBeNull()
        expect(reorderSkills(list, 'a', 'missing')).toBeNull()
        expect(reorderSkills(list, 'missing', 'a')).toBeNull()
    })

    it('does not mutate the input', () => {
        const frozen = Object.freeze(list.slice())
        reorderSkills(frozen, 'a', 'd')
        expect(ids([...frozen])).toEqual(['a', 'b', 'c', 'd'])
    })
})
