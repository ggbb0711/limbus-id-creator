import { isSupportedImageType, supportedDataUrl, truncateText } from './socialCard'

describe('social card helpers', () => {
    it('accepts only image types the renderer can draw', () => {
        expect(isSupportedImageType('image/png')).toBe(true)
        expect(isSupportedImageType('image/jpeg; charset=binary')).toBe(true)
        expect(isSupportedImageType('image/webp')).toBe(false)
        expect(isSupportedImageType(null)).toBe(false)
    })

    it('keeps supported data URLs only', () => {
        expect(supportedDataUrl('data:image/png;base64,AAA')).toBe('data:image/png;base64,AAA')
        expect(supportedDataUrl('data:image/webp;base64,AAA')).toBeNull()
        expect(supportedDataUrl('data:text/html;base64,AAA')).toBeNull()
    })

    it('truncates long text on a word-ish boundary with an ellipsis', () => {
        expect(truncateText('short', 10)).toBe('short')
        expect(truncateText('  spaced\n out  ', 20)).toBe('spaced out')
        expect(truncateText('abcdefghij', 5)).toBe('abcd…')
    })
})
