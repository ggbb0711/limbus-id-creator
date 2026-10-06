import imageCompression from 'browser-image-compression'
import { createIdInfo } from 'features/cardCreator/types/IIdInfo'
import { createOffenseSkill } from 'features/cardCreator/types/skills/offenseSkill/IOffenseSkill'
import { CARD_PREVIEW_LABEL, SaveImageError, prepareCloudSaveForm } from './prepareCloudSave'
import { describeImageTarget } from './cloudSaveForm'

jest.mock('browser-image-compression', () => Object.assign(jest.fn(), {
    getFilefromDataUrl: jest.fn(async (data: string) => new File([data], 'f')),
    getDataUrlFromFile: jest.fn(),
}))
jest.mock('features/cardCreator/utils/image/TurnRefToImg', () => ({ __esModule: true, default: jest.fn(async () => 'data:image/png;base64,AAAA') }))
jest.mock('features/cardCreator/utils/image/getImageDimensions', () => ({ __esModule: true, default: jest.fn(async () => ({ width: 900, height: 600 })) }))

const compress = jest.mocked(imageCompression)
const IMAGE = 'data:image/png;base64,iVBORw0KGgo='
const ref = { current: document.createElement('div') }

const saveFile = () => ({
    id: 's1', name: 'Save', saveTime: '', updateTime: '', previewImg: '',
    saveInfo: createIdInfo({
        splashArt: IMAGE,
        skillDetails: [createOffenseSkill({ skillImage: '' }), createOffenseSkill({ skillImage: '' }), createOffenseSkill({ skillImage: IMAGE })],
    }),
})

describe('describeImageTarget', () => {
    it('names each kind of image', () => {
        expect(describeImageTarget({ kind: 'sinnerIcon' })).toBe('Sinner icon')
        expect(describeImageTarget({ kind: 'splashArt' })).toBe('Splash art')
        expect(describeImageTarget({ kind: 'skill', index: 2 })).toBe('Skill 3 image')
    })
})

describe('prepareCloudSaveForm', () => {
    beforeEach(() => compress.mockReset())

    it('builds the form when every image compresses', async () => {
        compress.mockImplementation(async () => new File(['x'], 'c.webp'))
        const form = await prepareCloudSaveForm(saveFile(), ref)
        expect(form.get('thumbnailImage')).toBeTruthy()
        expect(form.get('splashArtImg')).toBeTruthy()
        expect(form.get('SkillImages[0].Index')).toBe('2')
        const saved = JSON.parse(form.get('SaveData') as string)
        expect(saved.saveInfo.splashArt).toBe('')
        expect(saved.saveTime).not.toBe('')
    })

    it('names every image that failed instead of failing generically', async () => {
        compress.mockImplementation(async (_file, options) => {
            if (options.maxWidthOrHeight) return new File(['x'], 'thumb.webp')
            throw new Error('corrupt')
        })
        const error = await prepareCloudSaveForm(saveFile(), ref).catch((e: unknown) => e) as SaveImageError
        expect(error).toBeInstanceOf(SaveImageError)
        expect(error.assets.sort()).toEqual(['Skill 3 image', 'Splash art'])
        expect(error.message).toMatch(/^Couldn't process: /)
    })

    it('names an image whose data url cannot be decoded', async () => {
        const broken = 'data:image/png;base64,BROKEN'
        jest.mocked(imageCompression.getFilefromDataUrl).mockImplementation(async (data: string) => {
            if (data === broken) throw new TypeError('bad data url')
            return new File([data], 'f')
        })
        compress.mockImplementation(async () => new File(['x'], 'c.webp'))
        const file = saveFile()
        file.saveInfo.splashArt = broken
        const error = await prepareCloudSaveForm(file, ref).catch((e: unknown) => e) as SaveImageError
        expect(error).toBeInstanceOf(SaveImageError)
        expect(error.assets).toEqual(['Splash art'])
    })

    it('reports a failed card preview', async () => {
        const turnRefToImg = jest.mocked((await import('features/cardCreator/utils/image/TurnRefToImg')).default)
        turnRefToImg.mockRejectedValueOnce(new Error('canvas tainted'))
        compress.mockImplementation(async () => new File(['x'], 'c.webp'))
        const error = await prepareCloudSaveForm(saveFile(), ref).catch((e: unknown) => e) as SaveImageError
        expect(error.assets).toEqual([CARD_PREVIEW_LABEL])
    })

    it('does not mutate the save file', async () => {
        compress.mockImplementation(async () => new File(['x'], 'c.webp'))
        const file = saveFile()
        await prepareCloudSaveForm(file, ref)
        expect(file.saveTime).toBe('')
        expect(file.saveInfo.splashArt).toBe(IMAGE)
    })
})
