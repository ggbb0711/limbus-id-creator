import { SKILL_DATA, clearSkillImage, getSkillData, migrateSkill, readSkillImage } from './skillData'
import { SKILL_TYPES } from 'features/cardCreator/types/SkillTypes'
import { SkillDetail } from 'features/cardCreator/types/SkillDetail'
import { IOffenseSkill, createOffenseSkill } from 'features/cardCreator/types/skills/offenseSkill/IOffenseSkill'
import { IDefenseSkill, createDefenseSkill } from 'features/cardCreator/types/skills/defenseSkill/IDefenseSkill'
import { createCustomEffect } from 'features/cardCreator/types/skills/customEffect/ICustomEffect'
import { createMentalEffect } from 'features/cardCreator/types/skills/mentalEffect/IMentalEffect'

const withoutId = (skill: SkillDetail) => ({ ...skill, inputId: '' })

describe('SKILL_DATA', () => {
    it('has an entry for every skill type, in the same order', () => {
        expect(Object.keys(SKILL_DATA)).toEqual([...SKILL_TYPES])
    })

    it.each(SKILL_TYPES)('%s: create() returns its own type', type => {
        expect(getSkillData(type).create().type).toBe(type)
    })

    it.each(SKILL_TYPES)('%s: migrate({}) equals create() apart from the id', type => {
        const data = getSkillData(type)
        expect(withoutId(data.migrate({}))).toEqual(withoutId(data.create()))
    })

    it('keeps the labels shown in the UI', () => {
        expect(SKILL_TYPES.map(type => SKILL_DATA[type].label)).toEqual(['Offensive skill', 'Defense skill', 'Passive skill', 'Custom effect', 'Mental effect'])
    })
})

describe('migrateSkill', () => {
    it('fills fields missing from old saves and keeps the saved values', () => {
        const legacy: Partial<IDefenseSkill> = createDefenseSkill({ name: 'Old guard', basePower: 7 })
        delete legacy.showDefenseIcon
        const migrated = migrateSkill(legacy as SkillDetail)
        expect(migrated).toMatchObject({ type: 'DefenseSkill', name: 'Old guard', basePower: 7, showDefenseIcon: true, inputId: legacy.inputId })
    })

    it('gives active skills without a frame the default frame', () => {
        const legacy: Partial<IOffenseSkill> = createOffenseSkill()
        delete legacy.skillFrame
        expect(migrateSkill(legacy as SkillDetail)).toMatchObject({ skillFrame: '1' })
    })

    it('leaves skills of an unknown type untouched', () => {
        const unknown = { type: 'Unknown', inputId: 'x' } as unknown as SkillDetail
        expect(migrateSkill(unknown)).toBe(unknown)
    })
})

describe('skill images', () => {
    it('reads and clears the image field of skills that have one', () => {
        const offense = createOffenseSkill({ skillImage: 'data:image/png;base64,AAA' })
        const custom = createCustomEffect({ customImg: 'data:image/png;base64,BBB' })
        expect(readSkillImage(offense)).toBe('data:image/png;base64,AAA')
        expect(readSkillImage(custom)).toBe('data:image/png;base64,BBB')
        expect(clearSkillImage(offense)).toMatchObject({ skillImage: '' })
        expect(clearSkillImage(custom)).toMatchObject({ customImg: '' })
        expect(offense.skillImage).toBe('data:image/png;base64,AAA')
    })

    it('returns nothing for skills without an image', () => {
        const mental = createMentalEffect()
        expect(readSkillImage(mental)).toBeUndefined()
        expect(clearSkillImage(mental)).toBe(mental)
    })

    it('uses the custom image as the tab icon when there is one', () => {
        expect(getSkillData('CustomEffect').tabIcon(createCustomEffect({ customImg: '/x.webp' }))).toBe('/x.webp')
        expect(getSkillData('CustomEffect').tabIcon(createCustomEffect())).toBe('/Images/status-effect/Discard.webp')
    })
})
