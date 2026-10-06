import imageCompression from 'browser-image-compression'
import { appConfig } from 'config/env.client'
import getImageDimensions from 'features/cardCreator/utils/image/getImageDimensions'
import { compressAndReadImage, compressImage, dataUrlToFile, scaledMaxDimension } from './compressImage'

jest.mock('browser-image-compression', () => Object.assign(jest.fn(), { getFilefromDataUrl: jest.fn(), getDataUrlFromFile: jest.fn() }))
jest.mock('features/cardCreator/utils/image/getImageDimensions', () => ({ __esModule: true, default: jest.fn() }))

const compress = jest.mocked(imageCompression)
const dimensions = jest.mocked(getImageDimensions)
const file = new File(['x'], 'in.png', { type: 'image/png' })
const output = new File(['y'], 'out.webp')

beforeEach(() => {
    compress.mockReset().mockResolvedValue(output)
    dimensions.mockReset().mockResolvedValue({ width: 900, height: 600 })
})

describe('scaledMaxDimension', () => {
    it('never goes below the configured minimum', () => {
        expect(scaledMaxDimension(900)).toBe(appConfig.image.compressMinDimension)
    })

    it('uses two thirds of large widths, rounded down', () => {
        expect(scaledMaxDimension(6001)).toBe(4000)
    })
})

describe('compressImage', () => {
    it('keeps the format and size by default', async () => {
        expect(await compressImage(file)).toBe(output)
        expect(compress).toHaveBeenCalledWith(file, { maxSizeMB: appConfig.image.compressMaxSizeMB, useWebWorker: true })
        expect(dimensions).not.toHaveBeenCalled()
    })

    it('converts to webp with the configured quality', async () => {
        await compressImage(file, { webp: true })
        expect(compress.mock.calls[0][1]).toMatchObject({ fileType: 'image/webp', initialQuality: appConfig.image.webpQuality })
        expect(compress.mock.calls[0][1]).not.toHaveProperty('maxWidthOrHeight')
    })

    it('resizes based on the image width', async () => {
        dimensions.mockResolvedValue({ width: 6000, height: 100 })
        await compressImage(file, { resize: true })
        expect(compress.mock.calls[0][1]).toMatchObject({ maxWidthOrHeight: 4000 })
    })

    it('rejects when the image cannot be measured', async () => {
        dimensions.mockRejectedValue(new Error('corrupt'))
        await expect(compressImage(file, { resize: true })).rejects.toThrow('corrupt')
        expect(compress).not.toHaveBeenCalled()
    })
})

describe('dataUrlToFile', () => {
    it('delegates to the library', async () => {
        jest.mocked(imageCompression.getFilefromDataUrl).mockResolvedValue(output)
        expect(await dataUrlToFile('data:image/png;base64,AAAA')).toBe(output)
        expect(imageCompression.getFilefromDataUrl).toHaveBeenCalledWith('data:image/png;base64,AAAA', 'image')
    })

    it('rejects instead of throwing for a malformed url', async () => {
        jest.mocked(imageCompression.getFilefromDataUrl).mockRejectedValue(new TypeError('bad'))
        await expect(dataUrlToFile('nope')).rejects.toThrow('bad')
    })
})

describe('compressAndReadImage', () => {
    it('resizes, compresses and reads the result as a data url', async () => {
        jest.mocked(imageCompression.getDataUrlFromFile).mockResolvedValue('data:image/png;base64,ZZZ')
        expect(await compressAndReadImage(file)).toBe('data:image/png;base64,ZZZ')
        expect(compress.mock.calls[0][1]).toHaveProperty('maxWidthOrHeight')
        expect(compress.mock.calls[0][1]).not.toHaveProperty('fileType')
        expect(imageCompression.getDataUrlFromFile).toHaveBeenCalledWith(output)
    })
})
