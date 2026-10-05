import stripHtml from 'utils/stripHtml'

describe('stripHtml', () => {
    it('removes tags and decodes entities', () => {
        expect(stripHtml('<p>Hello&nbsp;<b>world</b> &amp; co</p>')).toBe('Hello world & co')
    })

    it('returns an empty string for markup-only input', () => {
        expect(stripHtml('<p><br></p>')).toBe('')
    })
})
