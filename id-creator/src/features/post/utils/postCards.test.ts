import { matchCardsToImages, toPostCards } from './postCards'
import { IPostCardSnapshot } from 'features/post/types/IPost'

const card = (overrides: Partial<IPostCardSnapshot>): IPostCardSnapshot => ({
    position: 0, kind: 'Identity', imageUrl: 'https://cdn.test/a.png', saveInfo: { title: 'LCB', name: 'Faust' }, ...overrides,
})

describe('toPostCards', () => {
    it('orders cards by position and migrates each kind', () => {
        const cards = toPostCards({
            cards: [
                card({ position: 1, kind: 'Ego', imageUrl: 'b', saveInfo: { name: 'Ego name', egoLevel: 'HE' } }),
                card({ position: 0, imageUrl: 'a', saveInfo: { name: 'Id name', hp: 120 } }),
            ],
        })

        expect(cards.map(c => c.imageUrl)).toEqual(['a', 'b'])
        expect(cards[0]).toMatchObject({ kind: 'Identity', info: { name: 'Id name', hp: 120 } })
        expect(cards[1]).toMatchObject({ kind: 'Ego', info: { name: 'Ego name', egoLevel: 'HE' } })
    })

    it('skips cards whose saved data is not an object', () => {
        expect(toPostCards({ cards: [card({ saveInfo: null }), card({ saveInfo: 'text' })] })).toEqual([])
    })

    it('returns nothing for posts without cards', () => {
        expect(toPostCards({})).toEqual([])
    })
})

describe('matchCardsToImages', () => {
    it('lines cards up with images by url and leaves unmatched images empty', () => {
        const a = { imageUrl: 'a' }
        const c = { imageUrl: 'c' }
        expect(matchCardsToImages(['a', 'b', 'c'], [c, a])).toEqual([a, null, c])
    })

    it('uses each card once when two images share a url', () => {
        const first = { imageUrl: 'x', id: 1 }
        const second = { imageUrl: 'x', id: 2 }
        expect(matchCardsToImages(['x', 'x', 'x'], [first, second])).toEqual([first, second, null])
    })
})
