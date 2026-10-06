import { ChosenSave, addChosenSave, buildUploadTags, validateNewPost } from './newPost'
import { TagList } from './TagList'

const limits = { maxTitleLength: 10, maxImages: 2, maxUserTags: 2 }
const save = (previewUrl: string, kind: ChosenSave['kind'] = 'Identity'): ChosenSave => ({ previewUrl, kind })

describe('validateNewPost', () => {
    it('rejects a whitespace-only or too long title', () => {
        expect(validateNewPost({ title: '   ', saves: [save('a')] }, limits)).toMatch(/Post name length/)
        expect(validateNewPost({ title: 'x'.repeat(11), saves: [save('a')] }, limits)).toMatch(/Post name length/)
    })

    it('needs between 1 and maxImages saves', () => {
        expect(validateNewPost({ title: 'ok', saves: [] }, limits)).toMatch(/between 1 and 2 images/)
        expect(validateNewPost({ title: 'ok', saves: [save('a'), save('b'), save('c')] }, limits)).toMatch(/images/)
    })

    it('accepts a valid post', () => {
        expect(validateNewPost({ title: ' ok ', saves: [save('a')] }, limits)).toBeNull()
    })
})

describe('buildUploadTags', () => {
    it('adds each auto tag once', () => {
        expect(buildUploadTags([], [save('a'), save('b'), save('c', 'Ego')], 2)).toEqual({ tags: ['Identity', 'Ego'] })
    })

    it('does not duplicate a tag the user already picked', () => {
        expect(buildUploadTags([TagList.Identity, TagList.Faust], [save('a')], 2)).toEqual({ tags: ['Identity', 'Faust'] })
    })

    it('errors past the limit including the auto tag', () => {
        const result = buildUploadTags([TagList.Faust, TagList.Burn], [save('a'), save('b', 'Ego')], 2)
        expect(result).toEqual({ error: 'Post cannot have more than 3 tags (including the Identity/Ego tag)' })
    })
})

describe('addChosenSave', () => {
    it('ignores duplicates and respects the limit', () => {
        const one = addChosenSave([], save('a'), 2)
        expect(addChosenSave(one, save('a'), 2)).toBe(one)
        const two = addChosenSave(one, save('b'), 2)
        expect(two).toHaveLength(2)
        expect(addChosenSave(two, save('c'), 2)).toBe(two)
    })
})
