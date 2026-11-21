import { ChosenSave, addChosenSave, buildUploadTags, canRemoveSave, canUpdateSave, chosenSaveKey, chosenSaveStatus, chosenSavesFromPost, isSameSave, markForUpdate, replaceChosenSave, toCardRequests, undoChosenSave, userTagsFromPost, validateNewPost } from './newPost'
import { IPost } from 'features/post/types/IPost'
import { TagList } from './TagList'

const limits = { maxTitleLength: 10, maxImages: 2, maxUserTags: 2 }
const save = (saveId: string, kind: ChosenSave['kind'] = 'Identity'): ChosenSave => ({ saveId, previewUrl: `https://cdn.test/${saveId}.png`, kind })

describe('validateNewPost', () => {
    it('rejects a whitespace-only or too long title', () => {
        expect(validateNewPost({ title: '   ', saves: [save('a')] }, limits)).toMatch(/Post name length/)
        expect(validateNewPost({ title: 'x'.repeat(11), saves: [save('a')] }, limits)).toMatch(/Post name length/)
    })

    it('needs between 1 and maxImages saves', () => {
        expect(validateNewPost({ title: 'ok', saves: [] }, limits)).toMatch(/between 1 and 2 images/)
        expect(validateNewPost({ title: 'ok', saves: [save('a'), save('b'), save('c')] }, limits)).toMatch(/images/)
    })

    it('accepts the exact limits', () => {
        expect(validateNewPost({ title: 'x'.repeat(10), saves: [save('a'), save('b')] }, limits)).toBeNull()
    })

    it('reports the title before the images', () => {
        expect(validateNewPost({ title: '', saves: [] }, limits)).toMatch(/Post name length/)
    })

    it('measures the trimmed title', () => {
        expect(validateNewPost({ title: '  ' + 'x'.repeat(10) + '  ', saves: [save('a')] }, limits)).toBeNull()
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

const kept = (cardId: string, saveId: string | null = `save-${cardId}`): ChosenSave => ({ cardId, saveId, previewUrl: `https://cdn.test/${cardId}.png`, kind: 'Identity' })

describe('isSameSave', () => {
    it('never matches two cards whose saves were deleted', () => {
        expect(isSameSave(kept('a', null), kept('b', null))).toBe(false)
    })
})

describe('chosenSaveKey', () => {
    it('uses the card id for kept cards and the save otherwise', () => {
        expect(chosenSaveKey(kept('a'))).toBe('a')
        expect(chosenSaveKey(save('s', 'Ego'))).toBe('Ego-s')
    })
})

describe('chosenSavesFromPost', () => {
    it('maps the post cards in position order', () => {
        const post = {
            cards: [
                { id: 'c2', position: 1, kind: 'Ego', imageUrl: 'two.png', saveId: 's2', saveInfo: {} },
                { id: 'c1', position: 0, kind: 'Identity', imageUrl: 'one.png', saveId: null, saveInfo: {} },
            ],
        } as unknown as IPost

        expect(chosenSavesFromPost(post)).toEqual([
            { cardId: 'c1', saveId: null, kind: 'Identity', previewUrl: 'one.png' },
            { cardId: 'c2', saveId: 's2', kind: 'Ego', previewUrl: 'two.png' },
        ])
    })

    it('returns nothing for a post without cards', () => {
        expect(chosenSavesFromPost({} as IPost)).toEqual([])
    })
})

describe('markForUpdate', () => {
    it('drops the card id and remembers the original', () => {
        const saves = [kept('a')]
        const [updated] = markForUpdate(saves, 0)

        expect(updated.cardId).toBeUndefined()
        expect(updated.saveId).toBe('save-a')
        expect(updated.original).toBe(saves[0])
        expect(chosenSaveStatus(updated)).toBe('updating')
    })

    it('does nothing when the save was deleted or the card is new', () => {
        const deleted = [kept('a', null)]
        const fresh = [save('s')]
        expect(canUpdateSave(deleted[0])).toBe(false)
        expect(markForUpdate(deleted, 0)).toBe(deleted)
        expect(markForUpdate(fresh, 0)).toBe(fresh)
    })
})

describe('replaceChosenSave', () => {
    it('swaps the slot and keeps the original for undo', () => {
        const saves = [kept('a'), kept('b')]
        const replaced = replaceChosenSave(saves, 0, save('new'))

        expect(replaced.map(s => s.saveId)).toEqual(['new', 'save-b'])
        expect(chosenSaveStatus(replaced[0])).toBe('replaced')
        expect(undoChosenSave(replaced, 0)).toEqual(saves)
    })

    it('rejects a save already used by another slot', () => {
        const saves = [kept('a'), save('s')]
        expect(replaceChosenSave(saves, 0, save('s'))).toBe(saves)
    })

    it('keeps the first original across several replacements', () => {
        const saves = [kept('a')]
        const twice = replaceChosenSave(replaceChosenSave(saves, 0, save('x')), 0, save('y'))
        expect(twice[0].original).toBe(saves[0])
    })
})

describe('undoChosenSave', () => {
    it('does nothing when there is no original', () => {
        const saves = [save('s')]
        expect(undoChosenSave(saves, 0)).toBe(saves)
    })
})

describe('chosenSaveStatus', () => {
    it('labels kept and new cards', () => {
        expect(chosenSaveStatus(kept('a'))).toBe('kept')
        expect(chosenSaveStatus(save('s'))).toBe('new')
    })
})

describe('canRemoveSave', () => {
    it('needs more than one card', () => {
        expect(canRemoveSave([kept('a')])).toBe(false)
        expect(canRemoveSave([kept('a'), kept('b')])).toBe(true)
    })
})

describe('toCardRequests', () => {
    it('keeps cards by id and copies the rest from their save', () => {
        expect(toCardRequests([kept('a'), save('s', 'Ego'), markForUpdate([kept('b')], 0)[0]])).toEqual([
            { cardId: 'a' },
            { saveId: 's', kind: 'Ego' },
            { saveId: 'save-b', kind: 'Identity' },
        ])
    })
})

describe('userTagsFromPost', () => {
    it('drops the automatic Identity/Ego tags and unknown tags', () => {
        expect(userTagsFromPost(['Identity', 'Burn', 'Ego', 'Unknown'])).toEqual([TagList.Burn])
    })
})
