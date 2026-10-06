import { createEgoInfo } from 'features/cardCreator/types/IEgoInfo'
import { createIdInfo } from 'features/cardCreator/types/IIdInfo'
import { CURRENT_SCHEMA_VERSION, fixAssetPath, migrateEgoInfo, migrateIdInfo, migrateSaveFile, migrateSkills } from './migrateCardInfo'

describe('fixAssetPath', () => {
    it.each([
        ['Images/sinner-icon/Faust.png', '/Images/sinner-icon/Faust.webp'],
        ['/Images/sinner-icon/Faust.png', '/Images/sinner-icon/Faust.webp'],
        ['/Images/sinner-icon/Faust.webp', '/Images/sinner-icon/Faust.webp'],
        ['data:image/png;base64,abc.png', 'data:image/png;base64,abc.png'],
    ])('turns %s into %s', (input, expected) => {
        expect(fixAssetPath(input, 'fallback')).toBe(expected)
    })

    it.each([undefined, null, '', 3])('falls back for %p', input => {
        expect(fixAssetPath(input, 'fallback')).toBe('fallback')
    })
})

describe('migrateSkills', () => {
    it('drops unknown types and non-objects', () => {
        const skills = migrateSkills([{ type: 'Bogus' }, null, 'x', { type: 'PassiveSkill', name: 'Keep' }])
        expect(skills).toHaveLength(1)
        expect(skills[0]).toMatchObject({ type: 'PassiveSkill', name: 'Keep' })
    })

    it('removes the legacy index field', () => {
        const [skill] = migrateSkills([{ type: 'PassiveSkill', index: 4 }])
        expect(skill).not.toHaveProperty('index')
    })

    it('fills showDefenseIcon on old defense skills', () => {
        const [skill] = migrateSkills([{ type: 'DefenseSkill', name: 'Guard' }])
        expect(skill).toMatchObject({ type: 'DefenseSkill', name: 'Guard', showDefenseIcon: true })
    })

    it('fills skillFrame on old offense skills', () => {
        const [skill] = migrateSkills([{ type: 'OffenseSkill', skillFrame: '' }])
        expect(skill).toMatchObject({ skillFrame: '1' })
    })

    it('returns an empty list for non-arrays', () => {
        expect(migrateSkills(undefined)).toEqual([])
    })
})

describe('migrateIdInfo', () => {
    it('returns defaults for null input', () => {
        const info = migrateIdInfo(null)
        const { skillDetails, ...rest } = createIdInfo()
        expect(info).toMatchObject({ ...rest, schemaVersion: CURRENT_SCHEMA_VERSION })
        expect(info.skillDetails).toHaveLength(skillDetails.length)
    })

    it('does not throw when sinnerIcon is missing', () => {
        expect(migrateIdInfo({ title: 'Old' }).sinnerIcon).toBe(createIdInfo().sinnerIcon)
    })

    it('fixes legacy png paths for icon and rarity', () => {
        const info = migrateIdInfo({ sinnerIcon: 'Images/sinner-icon/Faust.png', rarity: 'Images/rarity/3.png' })
        expect(info.sinnerIcon).toBe('/Images/sinner-icon/Faust.webp')
        expect(info.rarity).toBe('/Images/rarity/3.webp')
    })

    it('keeps only string traits and handles undefined', () => {
        expect(migrateIdInfo({ traits: ['a', 3, null, 'b'] }).traits).toEqual(['a', 'b'])
        expect(migrateIdInfo({ traits: undefined }).traits).toEqual([])
    })

    it('merges a partial splash art translation', () => {
        expect(migrateIdInfo({ splashArtTranslation: { x: 5 } }).splashArtTranslation).toEqual({ x: 5, y: 0 })
    })

    it('forces localSaveId to 1', () => {
        expect(migrateIdInfo({ localSaveId: 7 }).localSaveId).toBe(1)
    })

    it('keeps an existing empty skill list', () => {
        expect(migrateIdInfo({ skillDetails: [] }).skillDetails).toEqual([])
    })
})

describe('migrateEgoInfo', () => {
    it('merges partial sin records with defaults', () => {
        const info = migrateEgoInfo({ sinCost: { wrath: 3 }, sinResistant: { pride: 2, lust: 'x' } })
        expect(info.sinCost).toEqual({ ...createEgoInfo().sinCost, wrath: 3 })
        expect(info.sinResistant).toEqual({ ...createEgoInfo().sinResistant, pride: 2 })
    })

    it('uses default records when missing', () => {
        const info = migrateEgoInfo({})
        expect(info.sinCost).toEqual(createEgoInfo().sinCost)
        expect(info.sinResistant).toEqual(createEgoInfo().sinResistant)
    })
})

describe('migrateSaveFile', () => {
    it('maps legacy saveName to name', () => {
        const file = migrateSaveFile({ id: 'a', saveName: 'Old name', saveInfo: {} }, migrateIdInfo)
        expect(file.name).toBe('Old name')
        expect(file.id).toBe('a')
        expect(file.saveInfo.rarity).toBe(createIdInfo().rarity)
    })

    it('prefers name over saveName', () => {
        expect(migrateSaveFile({ name: 'New', saveName: 'Old' }, migrateIdInfo).name).toBe('New')
    })

    it('fills blanks for garbage input', () => {
        expect(migrateSaveFile(null, () => 'info')).toEqual({
            id: '', name: 'Untitled', saveTime: '', updateTime: '', previewImg: '', saveInfo: 'info',
        })
    })
})
