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

    it('falls back for fields with the wrong type', () => {
        const info = migrateIdInfo({ title: 5, hp: '120', staggerResist: null, splashArtScale: Infinity, slashResistant: 2 })
        const defaults = createIdInfo()
        expect(info.title).toBe(defaults.title)
        expect(info.hp).toBe(defaults.hp)
        expect(info.staggerResist).toBe(defaults.staggerResist)
        expect(info.splashArtScale).toBe(defaults.splashArtScale)
        expect(info.slashResistant).toBe(2)
    })

    it('keeps valid fields', () => {
        const info = migrateIdInfo({ title: 'Title', name: 'Name', hp: 120, minSpeed: 2, maxSpeed: 5, staggerResist: '60%', sinnerColor: '#fff' })
        expect(info).toMatchObject({ title: 'Title', name: 'Name', hp: 120, minSpeed: 2, maxSpeed: 5, staggerResist: '60%', sinnerColor: '#fff' })
    })

    it('drops unknown fields', () => {
        expect(migrateIdInfo({ title: 'T', bogus: 1 })).not.toHaveProperty('bogus')
    })

    it.each([[[]], ['text'], [42], [undefined]])('returns defaults for non-object input %p', raw => {
        const info = migrateIdInfo(raw)
        expect(info.rarity).toBe(createIdInfo().rarity)
        expect(info.traits).toEqual([])
        expect(info.schemaVersion).toBe(CURRENT_SCHEMA_VERSION)
    })

    it('uses the default translation for a non-object or bad coordinates', () => {
        expect(migrateIdInfo({ splashArtTranslation: [1, 2] }).splashArtTranslation).toEqual({ x: 0, y: 0 })
        expect(migrateIdInfo({ splashArtTranslation: { x: 'a', y: 3 } }).splashArtTranslation).toEqual({ x: 0, y: 3 })
    })

    it('uses the default skills when skillDetails is not an array', () => {
        expect(migrateIdInfo({ skillDetails: 'x' }).skillDetails).toHaveLength(createIdInfo().skillDetails.length)
    })

    it('overrides a stored schemaVersion', () => {
        expect(migrateIdInfo({ schemaVersion: 0 }).schemaVersion).toBe(CURRENT_SCHEMA_VERSION)
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

    it('uses default records when they are arrays', () => {
        expect(migrateEgoInfo({ sinCost: [1, 2] }).sinCost).toEqual(createEgoInfo().sinCost)
    })

    it('keeps a valid ego level and falls back for an unknown one', () => {
        expect(migrateEgoInfo({ egoLevel: 'HE' }).egoLevel).toBe('HE')
        expect(migrateEgoInfo({ egoLevel: 'GOD' }).egoLevel).toBe(createEgoInfo().egoLevel)
    })

    it('falls back for a non-numeric sanity cost', () => {
        expect(migrateEgoInfo({ sanityCost: '3' }).sanityCost).toBe(0)
        expect(migrateEgoInfo({ sanityCost: 3 }).sanityCost).toBe(3)
    })

    it('fixes legacy png paths for the sinner icon', () => {
        expect(migrateEgoInfo({ sinnerIcon: 'Images/sinner-icon/Faust.png' }).sinnerIcon).toBe('/Images/sinner-icon/Faust.webp')
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

    it('uses saveName when name has the wrong type', () => {
        expect(migrateSaveFile({ name: 5, saveName: 'Old' }, migrateIdInfo).name).toBe('Old')
    })

    it('blanks fields with the wrong type', () => {
        const file = migrateSaveFile({ id: 3, saveTime: {}, updateTime: null, previewImg: null, name: 'n' }, () => 'info')
        expect(file).toEqual({ id: '', name: 'n', saveTime: '', updateTime: '', previewImg: '', saveInfo: 'info' })
    })

    it('passes the raw saveInfo to the migrator', () => {
        const migrate = jest.fn(() => 'info')
        migrateSaveFile({ saveInfo: { title: 'x' } }, migrate)
        expect(migrate).toHaveBeenCalledWith({ title: 'x' })
    })

    it('handles array input', () => {
        expect(migrateSaveFile([], () => 'info').name).toBe('Untitled')
    })
})
