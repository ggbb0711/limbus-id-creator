import { CUSTOM_KEYWORDS_STORAGE_KEY, loadCustomKeywords, parseCustomKeywords, saveCustomKeywords } from './customKeywordStorage'

const keyword = { customKeywordID: 'a', keyword: 'Burn', color: '#ff0000' }

describe('customKeywordStorage', () => {
    beforeEach(() => localStorage.clear())

    it('round-trips saved keywords', () => {
        saveCustomKeywords([keyword])
        expect(loadCustomKeywords()).toEqual([keyword])
    })

    it('returns an empty list when nothing is stored', () => {
        expect(loadCustomKeywords()).toEqual([])
    })

    it.each(['{not json', '{"a":1}', 'null', '42'])('ignores corrupt data %p', raw => {
        expect(parseCustomKeywords(raw)).toEqual([])
    })

    it('drops entries with the wrong shape', () => {
        localStorage.setItem(CUSTOM_KEYWORDS_STORAGE_KEY, JSON.stringify([keyword, { keyword: 'x' }, null]))
        expect(loadCustomKeywords()).toEqual([keyword])
    })
})
