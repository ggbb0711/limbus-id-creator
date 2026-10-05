import { getActiveRequirements } from './getActiveRequirements'
import { createSinRecord } from 'features/cardCreator/constants'

describe('getActiveRequirements', () => {
    it('returns nothing when no sin is required', () => {
        expect(getActiveRequirements(createSinRecord(0))).toEqual([])
    })

    it('keeps the sin order, skips amounts below 1 and capitalises icon names', () => {
        const requirements = { ...createSinRecord(0), envy: 1, wrath: 2, gloom: 0.5 }
        expect(getActiveRequirements(requirements)).toEqual([
            { key: 'wrath', amount: 2, iconName: 'Wrath' },
            { key: 'envy', amount: 1, iconName: 'Envy' },
        ])
    })
})
