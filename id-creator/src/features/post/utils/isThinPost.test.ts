import { THIN_POST_MAX_WORDS, isThinPost } from './isThinPost'

const words = (count: number) => `<p>${Array.from({ length: count }, (_, i) => `word${i}`).join(' ')}</p>`

describe('isThinPost', () => {
    it('is thin with no cards and a short description', () => {
        expect(isThinPost({ description: words(THIN_POST_MAX_WORDS - 1) })).toBe(true)
    })

    it('is not thin once the description reaches the word limit', () => {
        expect(isThinPost({ description: words(THIN_POST_MAX_WORDS) })).toBe(false)
    })

    it('is not thin when the post has cards, even with no description', () => {
        expect(isThinPost({ description: '', hasCards: true })).toBe(false)
        expect(isThinPost({ description: '', slides: [{ imageUrl: 'a', card: { id: 'c1', position: 0, kind: 'Identity', imageUrl: 'a', saveInfo: {} } }] })).toBe(false)
    })

    it('is thin when its slides are only plain images', () => {
        expect(isThinPost({ description: '', slides: [{ imageUrl: 'a', card: null }] })).toBe(true)
    })
})
