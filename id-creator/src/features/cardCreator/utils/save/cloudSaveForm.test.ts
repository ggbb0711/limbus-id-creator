import { buildSaveFormData, collectBase64Images } from './cloudSaveForm'
import { createIdInfo } from 'features/cardCreator/types/IIdInfo'
import { createOffenseSkill } from 'features/cardCreator/types/skills/offenseSkill/IOffenseSkill'
import { createCustomEffect } from 'features/cardCreator/types/skills/customEffect/ICustomEffect'
import { createMentalEffect } from 'features/cardCreator/types/skills/mentalEffect/IMentalEffect'
import { createSaveFile } from './createSaveFile'

const png = (data: string) => `data:image/png;base64,${data}`

const deepFreeze = <T>(value: T): T => {
    if (value && typeof value === 'object') {
        Object.values(value).forEach(deepFreeze)
        Object.freeze(value)
    }
    return value
}

describe('collectBase64Images', () => {
    const info = deepFreeze(createIdInfo({
        sinnerIcon: png('ICON'),
        splashArt: '/Images/splash.webp',
        skillDetails: [
            createOffenseSkill({ skillImage: png('SKILL') }),
            createMentalEffect(),
            createCustomEffect({ customImg: png('CUSTOM') }),
            createOffenseSkill({ skillImage: 'https://cdn.example/skill.webp' }),
        ],
    }))

    it('finds every base64 image in order', () => {
        expect(collectBase64Images(info).images).toEqual([
            { dataUrl: png('ICON'), target: { kind: 'sinnerIcon' } },
            { dataUrl: png('SKILL'), target: { kind: 'skill', index: 0 } },
            { dataUrl: png('CUSTOM'), target: { kind: 'skill', index: 2 } },
        ])
    })

    it('returns a copy with those images cleared and skill indexes added', () => {
        const { stripped } = collectBase64Images(info)
        expect(stripped.sinnerIcon).toBe('')
        expect(stripped.splashArt).toBe('/Images/splash.webp')
        expect(stripped.skillDetails.map(skill => (skill as unknown as { index: number }).index)).toEqual([0, 1, 2, 3])
        expect(stripped.skillDetails[0]).toMatchObject({ skillImage: '' })
        expect(stripped.skillDetails[2]).toMatchObject({ customImg: '' })
        expect(stripped.skillDetails[3]).toMatchObject({ skillImage: 'https://cdn.example/skill.webp' })
    })

    it('leaves the original untouched', () => {
        collectBase64Images(info)
        expect(info.sinnerIcon).toBe(png('ICON'))
    })
})

describe('buildSaveFormData', () => {
    it('uses the field names the backend expects', () => {
        const save = createSaveFile(createIdInfo(), 'My save')
        const icon = new Blob(['icon'])
        const thumbnail = new Blob(['thumb'])
        const skillA = new Blob(['a'])
        const skillB = new Blob(['b'])
        const form = buildSaveFormData(save, thumbnail, [
            { target: { kind: 'skill', index: 4 }, file: skillA },
            { target: { kind: 'sinnerIcon' }, file: icon },
            { target: { kind: 'skill', index: 1 }, file: skillB },
        ])
        expect([...form.keys()]).toEqual([
            'sinnerIcon', 'thumbnailImage',
            'SkillImages[0].Image', 'SkillImages[0].Index',
            'SkillImages[1].Image', 'SkillImages[1].Index',
            'SaveData',
        ])
        expect(form.get('SkillImages[0].Index')).toBe('4')
        expect(form.get('SkillImages[1].Index')).toBe('1')
        expect(JSON.parse(form.get('SaveData') as string).name).toBe('My save')
    })
})
