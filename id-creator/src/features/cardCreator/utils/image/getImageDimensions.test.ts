import getImageDimensions from './getImageDimensions'

class FakeImage {
    static outcome: 'load' | 'error' = 'load'
    onload: (() => void) | null = null
    onerror: (() => void) | null = null
    naturalWidth = 640
    naturalHeight = 480
    set src(_value: string) {
        queueMicrotask(() => (FakeImage.outcome === 'load' ? this.onload : this.onerror)?.())
    }
}

describe('getImageDimensions', () => {
    const originalImage = global.Image
    const file = new File(['x'], 'a.png', { type: 'image/png' })
    let revoke: jest.Mock

    beforeEach(() => {
        global.Image = FakeImage as unknown as typeof Image
        revoke = jest.fn()
        Object.assign(URL, { createObjectURL: jest.fn(() => 'blob:url'), revokeObjectURL: revoke })
    })

    afterEach(() => {
        global.Image = originalImage
    })

    it('resolves with the natural size and frees the url', async () => {
        FakeImage.outcome = 'load'
        await expect(getImageDimensions(file)).resolves.toEqual({ width: 640, height: 480 })
        expect(revoke).toHaveBeenCalledWith('blob:url')
    })

    it('rejects for an image that cannot be decoded and frees the url', async () => {
        FakeImage.outcome = 'error'
        await expect(getImageDimensions(file)).rejects.toThrow('Could not read the image')
        expect(revoke).toHaveBeenCalledWith('blob:url')
    })

    it('rejects when an object url cannot be created', async () => {
        Object.assign(URL, { createObjectURL: jest.fn(() => { throw new Error('no url') }) })
        await expect(getImageDimensions(file)).rejects.toThrow('no url')
    })
})
