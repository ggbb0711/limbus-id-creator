import { copyToClipboard } from './copyToClipboard'

describe('copyToClipboard', () => {
    const original = navigator.clipboard

    afterEach(() => {
        Object.defineProperty(navigator, 'clipboard', { value: original, configurable: true })
    })

    const mockClipboard = (value: unknown) => Object.defineProperty(navigator, 'clipboard', { value, configurable: true })

    it('writes the text and reports success', async () => {
        const writeText = jest.fn().mockResolvedValue(undefined)
        mockClipboard({ writeText })
        expect(await copyToClipboard('hello')).toEqual({ ok: true, data: undefined })
        expect(writeText).toHaveBeenCalledWith('hello')
    })

    it('reports the error when writing is rejected', async () => {
        const error = new Error('denied')
        mockClipboard({ writeText: jest.fn().mockRejectedValue(error) })
        expect(await copyToClipboard('hello')).toEqual({ ok: false, error })
    })

    it('fails instead of throwing when the clipboard API is missing', async () => {
        mockClipboard(undefined)
        const result = await copyToClipboard('hello')
        expect(result.ok).toBe(false)
    })
})
