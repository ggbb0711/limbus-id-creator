import { createOffenseSkill } from './skills/offenseSkill/IOffenseSkill'
import { createDefenseSkill } from './skills/defenseSkill/IDefenseSkill'
import { createPassiveSkill } from './skills/passiveSkill/IPassiveSkill'
import { createCustomEffect } from './skills/customEffect/ICustomEffect'
import { createMentalEffect } from './skills/mentalEffect/IMentalEffect'
import { createIdInfo } from './IIdInfo'
import { createEgoInfo } from './IEgoInfo'
import { SkillDetail, isActiveSkill, isSkillType } from './SkillDetail'
import { SKILL_TYPES } from './SkillTypes'
import { SIN_KEYS, createSinRecord } from 'features/cardCreator/constants'

describe('skill factories', () => {
    it('createOffenseSkill returns the documented defaults', () => {
        const { inputId, ...rest } = createOffenseSkill()
        expect(inputId).toEqual(expect.any(String))
        expect(rest).toEqual({
            type: 'OffenseSkill',
            name: '', skillAffinity: 'Wrath', basePower: 0, coinNo: 1, coinPow: 0,
            skillImage: '', skillEffect: '', skillLabel: 'SKILL', skillFrame: '1',
            skillLevel: 0, skillAmt: 1, atkWeight: 1, damageType: 'Slash',
        })
    })

    it('gives every skill a unique inputId', () => {
        const ids = Array.from({ length: 20 }, () => createOffenseSkill().inputId)
        expect(new Set(ids).size).toBe(ids.length)
    })

    it('keeps 0 and empty-string overrides', () => {
        const skill = createOffenseSkill({ skillAmt: 0, skillLabel: '', coinNo: 0 })
        expect(skill.skillAmt).toBe(0)
        expect(skill.skillLabel).toBe('')
        expect(skill.coinNo).toBe(0)
    })

    it('never lets an override change the discriminant', () => {
        const overrides = { type: 'MentalEffect' } as unknown as Parameters<typeof createOffenseSkill>[0]
        expect(createOffenseSkill(overrides).type).toBe('OffenseSkill')
    })

    it('createDefenseSkill shares the active skill defaults and adds its own', () => {
        const skill = createDefenseSkill()
        expect(skill).toMatchObject({ type: 'DefenseSkill', skillLabel: 'Defense', defenseType: 'Block', showDefenseIcon: true, coinNo: 1, damageType: 'Slash' })
    })

    it('createPassiveSkill gives each skill its own zeroed sin records', () => {
        const a = createPassiveSkill()
        const b = createPassiveSkill()
        expect(a.reqOwn).toEqual(createSinRecord(0))
        expect(a.reqOwn).not.toBe(b.reqOwn)
        expect(Object.keys(a.reqRes)).toEqual(SIN_KEYS)
    })

    it('every factory produces its own type', () => {
        const created: SkillDetail[] = [createOffenseSkill(), createDefenseSkill(), createPassiveSkill(), createCustomEffect(), createMentalEffect()]
        expect(created.map(skill => skill.type)).toEqual([...SKILL_TYPES])
    })
})

describe('card factories', () => {
    it('createIdInfo keeps localSaveId at 1 and builds the default skills', () => {
        const info = createIdInfo()
        expect(info.localSaveId).toBe(1)
        expect(info.skillDetails.map(skill => skill.type)).toEqual(['OffenseSkill', 'OffenseSkill', 'OffenseSkill', 'DefenseSkill', 'PassiveSkill', 'PassiveSkill'])
        expect(info.skillDetails[0]).toMatchObject({ name: 'Skill 1', skillAffinity: 'Wrath', skillAmt: 3, skillLabel: 'SKILL 1' })
    })

    it('createEgoInfo uses neutral resistances and zero costs', () => {
        const info = createEgoInfo()
        expect(info.localSaveId).toBe(1)
        expect(info.sinResistant).toEqual(createSinRecord(1))
        expect(info.sinCost).toEqual(createSinRecord(0))
        expect(info.egoLevel).toBe('ZAYIN')
    })

    it('applies overrides on top of the defaults', () => {
        expect(createIdInfo({ name: 'Faust', hp: 0 })).toMatchObject({ name: 'Faust', hp: 0, rarity: '/Images/rarity/IDNumber1.webp' })
    })
})

describe('type guards', () => {
    it('isSkillType and isActiveSkill narrow by the discriminant', () => {
        const skills: SkillDetail[] = [createOffenseSkill(), createMentalEffect({ effect: 'calm' }), createDefenseSkill()]
        expect(skills.filter(isActiveSkill).map(skill => skill.type)).toEqual(['OffenseSkill', 'DefenseSkill'])
        const mental = skills.filter(isSkillType('MentalEffect'))
        expect(mental.map(skill => skill.effect)).toEqual(['calm'])
    })

    it('narrows SkillDetail without casts', () => {
        const skill: SkillDetail = createMentalEffect({ effect: 'calm' })
        if (skill.type === 'MentalEffect') {
            expect(skill.effect).toBe('calm')
        }
    })
})
