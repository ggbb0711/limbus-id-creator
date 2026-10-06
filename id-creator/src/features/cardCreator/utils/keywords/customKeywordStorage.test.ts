import { CUSTOM_KEYWORDS_STORAGE_KEY, loadCustomKeywords, parseCustomKeywords, saveCustomKeywords, subscribeCustomKeywords } from './customKeywordStorage'

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

    it('drops entries whose fields have the wrong type', () => {
        const raw = JSON.stringify([{ ...keyword, customKeywordID: 1 }, { ...keyword, color: null }, [keyword], keyword])
        expect(parseCustomKeywords(raw)).toEqual([keyword])
    })

    it('strips unknown fields', () => {
        expect(parseCustomKeywords(JSON.stringify([{ ...keyword, extra: true }]))).toEqual([keyword])
    })

    it.each([null, '', '   '])('returns an empty list for %p', raw => {
        expect(parseCustomKeywords(raw)).toEqual([])
    })

    it('returns an empty list when storage throws', () => {
        const spy = jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('denied') })
        expect(loadCustomKeywords()).toEqual([])
        spy.mockRestore()
    })

    it('does not throw when saving fails', () => {
        const spy = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('quota') })
        expect(() => saveCustomKeywords([keyword])).not.toThrow()
        spy.mockRestore()
    })
})

describe('subscribeCustomKeywords', () => {
    beforeEach(() => localStorage.clear())

    it('notifies after a save until unsubscribed', () => {
        const listener = jest.fn()
        const unsubscribe = subscribeCustomKeywords(listener)
        saveCustomKeywords([keyword])
        expect(listener).toHaveBeenCalledTimes(1)
        unsubscribe()
        saveCustomKeywords([])
        expect(listener).toHaveBeenCalledTimes(1)
    })

    it('notifies on storage events for its key from other tabs', () => {
        const listener = jest.fn()
        const unsubscribe = subscribeCustomKeywords(listener)
        window.dispatchEvent(new StorageEvent('storage', { key: 'other' }))
        expect(listener).not.toHaveBeenCalled()
        window.dispatchEvent(new StorageEvent('storage', { key: CUSTOM_KEYWORDS_STORAGE_KEY }))
        window.dispatchEvent(new StorageEvent('storage', { key: null }))
        expect(listener).toHaveBeenCalledTimes(2)
        unsubscribe()
        window.dispatchEvent(new StorageEvent('storage', { key: CUSTOM_KEYWORDS_STORAGE_KEY }))
        expect(listener).toHaveBeenCalledTimes(2)
    })
})
