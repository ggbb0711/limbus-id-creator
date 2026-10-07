import { IPost } from 'features/post/types/IPost'
import { transformPostsResponse } from 'features/post/api/PostApi'
import { toPostDisplayCard } from './toPostDisplayCard'

const post = (overrides: Partial<IPost> = {}): IPost => ({
    id: 'p1', title: 'Title', imagesAttach: ['a.webp', 'b.webp'], description: '<p>long</p>',
    userIcon: 'icon', userName: 'name', userId: 'u1', tags: ['Faust'], viewCount: 3, commentCount: 1, created: '2024-01-01',
    ...overrides,
})

describe('toPostDisplayCard', () => {
    it('uses the first attached image as the card image and drops the description', () => {
        const card = toPostDisplayCard(post())
        expect(card.cardImg).toBe('a.webp')
        expect(card).not.toHaveProperty('description')
        expect(card).not.toHaveProperty('imagesAttach')
    })

    it('falls back to an empty image', () => {
        expect(toPostDisplayCard(post({ imagesAttach: [] })).cardImg).toBe('')
    })
})

describe('transformPostsResponse', () => {
    it('maps the list and keeps the total', () => {
        const result = transformPostsResponse({ data: { list: [post(), post({ id: 'p2' })], total: 12 } } as never)
        expect(result.total).toBe(12)
        expect(result.list.map(card => [card.id, card.cardImg])).toEqual([['p1', 'a.webp'], ['p2', 'a.webp']])
    })
})
