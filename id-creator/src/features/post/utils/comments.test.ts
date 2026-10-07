import { IComment } from 'features/post/types/IComment'
import { appendCreatedComment, commentKey, hasMoreComments, mergeCommentPage, toCommentPage, toWallClock } from './comments'

const comment = (content: string, created = '2024-05-01T10:00:00.123456', userId = 'u1'): IComment => ({
    userId, userName: 'me', userIcon: '/u.webp', postId: 'p', content, created,
})

describe('hasMoreComments', () => {
    it.each([[10, 10, true], [3, 10, false], [0, 10, false], [0, 0, false]])('%d of %d -> %p', (length, limit, expected) => {
        expect(hasMoreComments(length, limit)).toBe(expected)
    })
})

describe('commentKey', () => {
    it('matches the POST and GET formats of the same comment', () => {
        const posted = comment('hi', '2024-05-01T10:00:00.1234567+07:00')
        const listed = comment('hi', '2024-05-01T10:00:00.123456')
        expect(commentKey(posted)).toBe(commentKey(listed))
    })

    it('tells apart comments posted in the same second', () => {
        expect(commentKey(comment('a'))).not.toBe(commentKey(comment('b')))
    })

    it('toWallClock keeps unexpected strings', () => {
        expect(toWallClock('2024-05-01T10:00:00Z')).toBe('2024-05-01T10:00:00')
        expect(toWallClock('weird')).toBe('weird')
    })
})

describe('mergeCommentPage', () => {
    it('replaces the cache with page 0', () => {
        const current = toCommentPage([comment('old')], 10)
        const incoming = toCommentPage([comment('new')], 10)
        expect(mergeCommentPage(current, incoming, 0)).toBe(incoming)
    })

    it('appends later pages without duplicates and takes their hasMore', () => {
        const current = toCommentPage([comment('a'), comment('b')], 2)
        const incoming = toCommentPage([comment('b'), comment('c')], 5)
        const merged = mergeCommentPage(current, incoming, 1)
        expect(merged.list.map(c => c.content)).toEqual(['a', 'b', 'c'])
        expect(merged.hasMore).toBe(false)
    })
})

describe('appendCreatedComment', () => {
    it('appends at the end once every page is loaded', () => {
        const current = toCommentPage([comment('a')], 10)
        expect(appendCreatedComment(current, comment('new')).list.map(c => c.content)).toEqual(['a', 'new'])
    })

    it('leaves the cache alone while more pages remain', () => {
        const current = toCommentPage([comment('a'), comment('b')], 2)
        expect(appendCreatedComment(current, comment('new'))).toBe(current)
    })

    it('does not add the same comment twice', () => {
        const current = toCommentPage([comment('a', '2024-05-01T10:00:00.123456')], 10)
        expect(appendCreatedComment(current, comment('a', '2024-05-01T10:00:00.1234567+07:00')).list).toHaveLength(1)
    })
})
