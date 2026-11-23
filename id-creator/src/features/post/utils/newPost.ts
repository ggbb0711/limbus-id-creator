import { z } from "zod"
import { SaveMode } from "features/cardCreator"
import { ITag, getTag } from "./TagList"
import { IPost } from "features/post/types/IPost"
import { PostCardUpdate } from "features/post/types/PostRequests"

export const POST_SAVE_KINDS = ["Identity", "Ego"] as const
export type PostSaveKind = typeof POST_SAVE_KINDS[number]

export interface ChosenSave {
    saveId: string | null
    previewUrl: string
    kind: PostSaveKind
    cardId?: string
    original?: ChosenSave
}

export const isSameSave = (a: ChosenSave, b: ChosenSave) => a.saveId !== null && a.saveId === b.saveId && a.kind === b.kind

export const chosenSaveKey = (save: ChosenSave) => save.cardId ?? `${save.kind}-${save.saveId}`

export const SAVE_MODE_BY_KIND: Record<PostSaveKind, SaveMode> = { Identity: "ID", Ego: "EGO" }

export interface NewPostLimits {
    maxTitleLength: number
    maxImages: number
    maxUserTags: number
}

const newPostSchema = ({ maxTitleLength, maxImages }: NewPostLimits) => {
    const titleMessage = `Post name length must be between 1 and ${maxTitleLength}`
    const imagesMessage = `Post must have between 1 and ${maxImages} images`
    return z.object({
        title: z.string().trim().min(1, titleMessage).max(maxTitleLength, titleMessage),
        saves: z.array(z.unknown()).min(1, imagesMessage).max(maxImages, imagesMessage),
    })
}

export function validateNewPost(post: { title: string, saves: readonly ChosenSave[] }, limits: NewPostLimits): string | null {
    const result = newPostSchema(limits).safeParse(post)
    return result.success ? null : result.error.issues[0].message
}

export type UploadTagsResult = { tags: string[] } | { error: string }

export function buildUploadTags(tags: readonly ITag[], saves: readonly ChosenSave[], maxUserTags: number): UploadTagsResult {
    const names = [...new Set(tags.map(tag => tag.tagName))]
    POST_SAVE_KINDS.forEach(kind => {
        if (saves.some(save => save.kind === kind) && !names.includes(kind)) names.push(kind)
    })
    const maxTotal = maxUserTags + 1
    if (names.length > maxTotal) return { error: `Post cannot have more than ${maxTotal} tags (including the Identity/Ego tag)` }
    return { tags: names }
}

export function addChosenSave(saves: readonly ChosenSave[], save: ChosenSave, maxImages: number): readonly ChosenSave[] {
    if (saves.length >= maxImages || saves.some(existing => isSameSave(existing, save))) return saves
    return [...saves, save]
}

export function chosenSavesFromPost(post: IPost): ChosenSave[] {
    return (post.slides ?? []).flatMap(({ card }) => card
        ? [{ cardId: card.id, saveId: card.saveId ?? null, kind: card.kind, previewUrl: card.imageUrl }]
        : [])
}

export const canUpdateSave = (save: ChosenSave) => save.cardId !== undefined && save.saveId !== null

export type ChosenSaveStatus = "kept" | "updating" | "replaced" | "new"

export function chosenSaveStatus(save: ChosenSave): ChosenSaveStatus {
    if (save.cardId) return "kept"
    if (!save.original) return "new"
    return save.original.saveId === save.saveId && save.original.kind === save.kind ? "updating" : "replaced"
}

const replaceAt = (saves: readonly ChosenSave[], index: number, save: ChosenSave) =>
    saves.map((existing, i) => (i === index ? save : existing))

export function markForUpdate(saves: readonly ChosenSave[], index: number): readonly ChosenSave[] {
    const save = saves[index]
    if (!save || !canUpdateSave(save)) return saves
    return replaceAt(saves, index, { saveId: save.saveId, previewUrl: save.previewUrl, kind: save.kind, original: save })
}

export function replaceChosenSave(saves: readonly ChosenSave[], index: number, save: ChosenSave): readonly ChosenSave[] {
    const current = saves[index]
    if (!current || saves.some((existing, i) => i !== index && isSameSave(existing, save))) return saves
    const original = current.original ?? (current.cardId ? current : undefined)
    return replaceAt(saves, index, { saveId: save.saveId, previewUrl: save.previewUrl, kind: save.kind, original })
}

export function undoChosenSave(saves: readonly ChosenSave[], index: number): readonly ChosenSave[] {
    const original = saves[index]?.original
    return original ? replaceAt(saves, index, original) : saves
}

export const canRemoveSave = (saves: readonly ChosenSave[]) => saves.length > 1

export function toCardRequests(saves: readonly ChosenSave[]): PostCardUpdate[] {
    return saves.flatMap((save): PostCardUpdate[] => {
        if (save.cardId) return [{ cardId: save.cardId }]
        return save.saveId ? [{ saveId: save.saveId, kind: save.kind }] : []
    })
}

const isPostSaveKind = (tag: string): tag is PostSaveKind => (POST_SAVE_KINDS as readonly string[]).includes(tag)

export function userTagsFromPost(tags: readonly string[]): ITag[] {
    return tags.filter(tag => !isPostSaveKind(tag)).flatMap(tag => {
        const known = getTag(tag)
        return known ? [known] : []
    })
}
