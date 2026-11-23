import { buildStatusEffectLookup, fromCustomEffect } from './StatusEffectInfo'
import { createCustomEffect } from './skills/customEffect/ICustomEffect'
import { createOffenseSkill } from './skills/offenseSkill/IOffenseSkill'

describe('fromCustomEffect', () => {
    it('maps the custom effect fields', () => {
        const effect = createCustomEffect({ name: 'Fanatic Rage', customImg: 'icon.webp', effectColor: '#ff0000', effect: '<p>Gain power</p>' })

        expect(fromCustomEffect(effect)).toEqual({
            key: 'fanatic_rage',
            name: 'Fanatic Rage',
            image: 'icon.webp',
            color: '#ff0000',
            description: '<p>Gain power</p>',
        })
    })
})

describe('buildStatusEffectLookup', () => {
    it('keys custom effects with a description by keyword key', () => {
        const lookup = buildStatusEffectLookup([
            createCustomEffect({ name: 'Fanatic', effect: '<p>Gain power</p>' }),
            createOffenseSkill({ name: 'Slash', skillEffect: '<p>Hit</p>' }),
        ])

        expect(Object.keys(lookup)).toEqual(['fanatic'])
        expect(lookup.fanatic.name).toBe('Fanatic')
    })

    it.each([
        ['empty', ''],
        ['whitespace only', '   '],
        ['empty tags only', '<p></p><p> </p>'],
    ])('skips effects with an %s description', (_, effect) => {
        expect(buildStatusEffectLookup([createCustomEffect({ name: 'Fanatic', effect })])).toEqual({})
    })

    it('skips unnamed effects', () => {
        expect(buildStatusEffectLookup([createCustomEffect({ name: ' ', effect: '<p>Text</p>' })])).toEqual({})
    })
})
